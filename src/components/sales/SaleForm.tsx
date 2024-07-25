import { useState } from "react"

import { SubmitHandler } from "react-hook-form"

import { useNavigate, useParams } from "react-router-dom"

// types
import {
  ISaleItemLessRelated,
  ISaleLessRelated,
  ISaleFullRelated,
  SaleStatus,
  ISaleItemOmitSale,
} from "./types"
import { IProductFullRelated } from "../products/types"
import { IClient } from "../clients/types"
import { IPaymentMethod } from "../paymentMethods/types"

// components
import SaleFormAdd from "./SaleAddForm"
// import ProductFormEdit from "./ProductEditForm";

// custom hooks
import { useProducts } from "../../hooks/useProducts"
import { useClients } from "../../hooks/useClients"
import { usePaymentMethods } from "../../hooks/usePaymentMethods"
import { useSaleItems } from "../../hooks/useSaleItems"
import { useEditManyInventory } from "../../hooks/useEditManyInventory"
import { useMessage } from "../../hooks/useMessage"
import { useError, Error } from "../../hooks/useError"

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import { useProductItems } from "../../hooks/useProductItems"
import { IProductItemFullRelated } from "../products/types"
import { useInventories } from "../../hooks/useInventories"
import {
  IInventoryFullRelated,
  IInventoryLessRelated,
} from "../inventories/types"
import { useNewManyInventoryTransaction } from "../../hooks/useNewManyInventoryTransaction"
import {
  IInventoryTransactionLessRelated,
  TransactionReason,
  TransactionType,
} from "../inventoryTransactions/types"
import { useNewSale } from "../../hooks/useNewSale"
import { useNewManySaleItem } from "../../hooks/useNewManySaleItem"

type ISaleResponse = {
  data?: ISaleFullRelated
  isStored?: boolean
  isUpdated?: boolean
  status?: number
}

const SaleForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { showMessage } = useMessage()

  const { throwError } = useError()

  const navigate = useNavigate()

  const { saleId } = useParams()

  // products
  const queryProducts = useProducts({})
  const queryProductItems = useProductItems({})
  const queryClients = useClients({})
  const queryPaymentMethod = usePaymentMethods({})
  const querySaleItems = useSaleItems({})
  const queryInventories = useInventories({})

  // const { addNewProduct } = useNewProduct();
  // const { addNewManyProductItem } = useNewManyProductItem();
  // const { editProduct } = useEditProduct();
  // const { editManyProductItem } = useEditManyProductItem();
  const { addNewSale } = useNewSale()
  const { editManyInventory } = useEditManyInventory()
  const { addNewManyInventoryTransaction } = useNewManyInventoryTransaction()
  const { addNewManySaleItem } = useNewManySaleItem()

  const products = queryProducts.data as IProductFullRelated[]
  const productItems = queryProductItems.data as IProductItemFullRelated[]
  const clients = queryClients.data as IClient[]
  const paymentMethods = queryPaymentMethod.data as IPaymentMethod[]
  const saleItems = querySaleItems.data as ISaleItemLessRelated[]
  const inventories = queryInventories.data as IInventoryFullRelated[]

  const productsById = new Map()

  products?.forEach((product) => {
    productsById.set(product._id, product)
  })

  const getTotalSale = (sale: ISaleLessRelated) => {
    let productIds = sale?.saleItems?.map((saleItem) => saleItem.product)

    let productWithSalePrice: IProductFullRelated[] = []

    productIds?.forEach((productId) =>
      products?.forEach((product) => {
        if (product._id === productId) {
          productWithSalePrice.push(product)
        }
      })
    )

    let productWithQuantity: ISaleItemOmitSale[] = []

    productWithSalePrice.forEach((product) => {
      sale.saleItems?.forEach((saleItem) => {
        if (product._id === saleItem.product) {
          productWithQuantity.push({
            product,
            quantity: saleItem.quantity,
          })
        }
      })
    })

    let totalSale = productWithQuantity
      ?.map((productWithQ) => {
        if (
          productWithQ.product?.retailsalePrice !== undefined &&
          productWithQ.quantity !== undefined
        ) {
          if (sale.isRetail) {
            return (
              Number(productWithQ.product.retailsalePrice) *
              Number(productWithQ.quantity)
            )
          }
          return (
            Number(productWithQ.product.wholesalePrice) *
            Number(productWithQ.quantity)
          )
        }
      })
      .reduce((acc, currentValue) => {
        if (acc !== undefined && currentValue !== undefined) {
          return acc + currentValue
        }
      }, 0)

    // aplico descuento
    let discount = sale?.discount !== undefined && !isNaN(sale?.discount) ? (sale?.discount / 100) : 0

    let totalSaleWithDiscount = totalSale !== undefined ? totalSale - (totalSale * discount) : 0

    return totalSaleWithDiscount
  }

  const onSubmit: SubmitHandler<ISaleLessRelated> = async (
    sale: ISaleLessRelated
  ) => {
    setIsLoading(true)
    try {
      let response: ISaleResponse = {
        data: undefined,
        isStored: undefined,
        status: undefined,
      }

      if (!saleId) {
        // Todo: actualizar el inventario de cada insumo.
        let assetQuantityByAssetId = new Map<string, number>()

        productItems.forEach((productItem) => {
          sale.saleItems?.forEach((saleItem) => {
            if (saleItem.product === productItem.product?._id) {
              if (
                assetQuantityByAssetId.has(productItem?.asset?._id as string)
              ) {
                let prevQuantity = assetQuantityByAssetId.get(
                  productItem?.asset?._id as string
                )
                assetQuantityByAssetId.set(
                  productItem.asset?._id as string,
                  Number(prevQuantity) +
                  Number(productItem.quantity) * Number(saleItem.quantity)
                )
              } else {
                assetQuantityByAssetId.set(
                  productItem.asset?._id as string,
                  (Number(productItem.quantity) *
                    Number(saleItem.quantity)) as number
                )
              }
            }
          })
        })
        let inventoriesToUpdate: IInventoryLessRelated[] = []

        // para usar en las transacciones: guardar valores viejos
        let oldInventories: IInventoryFullRelated[] = inventories

        assetQuantityByAssetId.forEach((value, key) => {
          inventories.forEach((inventory) => {
            let inventoryUpdated: IInventoryLessRelated = {
              asset: inventory.asset?._id,
              id: inventory._id,
              quantityAvailable: inventory.quantityAvailable,
            }
            if (key === inventory.asset?._id) {
              inventoryUpdated.quantityAvailable =
                inventoryUpdated.quantityAvailable !== undefined
                  ? inventoryUpdated.quantityAvailable - value
                  : inventoryUpdated.quantityAvailable
              inventoriesToUpdate.push(inventoryUpdated)
            }
          })
        })

        await editManyInventory(inventoriesToUpdate)

        // Todo: registrar las transacciones del inventario de cada insumo.

        let inventoryTransactions: IInventoryTransactionLessRelated[] = []

        assetQuantityByAssetId.forEach((value, key) => {
          inventoryTransactions.push({
            asset: key,
            affectedAmount: value,
            transactionType: TransactionType.DOWN,
            transactionReason: TransactionReason.SELL,
          })
        })


        // guardar los valores viejos y nuevos
        inventoryTransactions.forEach(inventoryTransaction => {
          oldInventories.forEach(oldInventory => {
            if (inventoryTransaction.asset === oldInventory.asset?._id) {
              inventoryTransaction.oldQuantityAvailable = oldInventory.quantityAvailable

              //unit cost
              inventoryTransaction.unitCost = oldInventory.asset?.costPrice
            }
          })
          inventoriesToUpdate.forEach(inventoryUpdated => {
            if (inventoryTransaction.asset === inventoryUpdated.asset) {
              inventoryTransaction.currentQuantityAvailable = inventoryUpdated.quantityAvailable

              let asset = inventories.find(inventory => inventory.asset?._id === inventoryUpdated.asset)?.asset
              //unit cost
              inventoryTransaction.unitCost = asset?.costPrice
            }
          })
        })


        await addNewManyInventoryTransaction(inventoryTransactions)

        // Todo: insertar la venta. 

        let costTotal = sale.saleItems?.map(saleItem => {
          let costTotal

          if (saleItem.quantity !== undefined) {
            costTotal = saleItem.quantity * productsById.get(saleItem.product).costPrice
          }

          return costTotal

        }).reduce((acc, currentValue) => {
          if (acc !== undefined && currentValue !== undefined) {
            return acc + currentValue
          }
        }, 0)


        sale.total = getTotalSale(sale)
        sale.costTotal = costTotal
        sale.status = SaleStatus.PAID
        response = await addNewSale(sale)

        // Todo: insertar los items de la venta.

        let saleItemWithSale = sale?.saleItems?.map((saleItem) => {
          let subTotal

          if (saleItem.quantity !== undefined) {
            subTotal = sale.isRetail
              ? saleItem?.quantity *
              productsById.get(saleItem.product).retailsalePrice
              : saleItem?.quantity *
              productsById.get(saleItem.product).wholesalePrice
          }

          let discount = sale?.discount !== undefined && !isNaN(sale?.discount) ? (sale?.discount / 100) : 0

          let subTotalWithDiscount = subTotal !== undefined ? subTotal - (subTotal * discount) : 0

          return {
            ...saleItem,
            sale: response?.data?._id,
            subtotal: subTotalWithDiscount,
          }
        })

        await addNewManySaleItem(saleItemWithSale as ISaleItemLessRelated[])

        if (response.isStored) {
          showMessage(
            RECORD_CREATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      } else {
        // let assetIds = product?.productItems?.map(
        //   (productItem) => productItem.asset
        // );
        // let assetWithCostPrice: IAssetFullCategory[] = [];
        // assetIds?.forEach((assetId) =>
        //   assets.forEach((asset) => {
        //     if (asset._id === assetId) {
        //       assetWithCostPrice.push(asset);
        //     }
        //   })
        // );
        // let assetWithQuantity: IProductItemOmitProduct[] = [];
        // assetWithCostPrice.forEach((asset) => {
        //   product.productItems?.forEach((productItem) => {
        //     if (asset._id === productItem.asset) {
        //       assetWithQuantity.push({
        //         asset,
        //         quantity: productItem.quantity,
        //       });
        //     }
        //   });
        // });
        // let totalCost = assetWithQuantity
        //   ?.map((assetWithQ) => {
        //     if (
        //       assetWithQ.asset?.costPrice !== undefined &&
        //       assetWithQ.quantity !== undefined
        //     ) {
        //       return (
        //         assetWithQ?.asset?.costPrice * Number(assetWithQ?.quantity)
        //       );
        //     }
        //   })
        //   .reduce((acc, currentValue) => {
        //     if (acc !== undefined && currentValue !== undefined) {
        //       return acc + currentValue;
        //     }
        //   }, 0);
        // response = await editProduct({
        //   productId,
        //   productToUpdate: { ...product, costPrice: totalCost },
        // });
        // let newProductItemWithProduct: IProductItemLessRelated[] = [];
        // let productItemsWithProductToUpdate: IProductItemLessRelated[] = [];
        // product?.productItems?.forEach((productItem) => {
        //   if (productItem.hasOwnProperty("id")) {
        //     productItemsWithProductToUpdate.push({
        //       ...productItem,
        //       product: productId,
        //     });
        //   }
        // });
        // product?.productItems?.forEach((productItem) => {
        //   if (!productItem.hasOwnProperty("id")) {
        //     newProductItemWithProduct.push({
        //       ...productItem,
        //       product: productId,
        //     });
        //   }
        // });
        // if (productItemsWithProductToUpdate.length > 0) {
        //   await editManyProductItem(
        //     productItemsWithProductToUpdate as IProductItemLessRelated[]
        //   );
        // }
        // if (newProductItemWithProduct.length > 0) {
        //   await addNewManyProductItem(
        //     newProductItemWithProduct as IProductItemLessRelated[]
        //   );
        // }
        // if (response.isUpdated) {
        //   showMessage(
        //     RECORD_UPDATED,
        //     AlertStatus.Success,
        //     AlertColorScheme.Purple
        //   );
        // }
      }
      if (response.status === 200 || response.status === 201) {
        navigate("/sales")
      }
    } catch (error: unknown) {
      throwError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const onCancelOperation = () => {
    navigate("/sales")
  }

  return (
    <>
      {/* {productId && (
        <ProductFormEdit
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          productToUpdate={
            {
              ...queryProducts?.data?.find((s) => s._id === productId),
            } as IProductFullRelated
          }
          isLoading={isLoading}
          categories={categories}
          productTypes={productTypes}
          assets={assets}
          productItems={productItems as IProductFullRelated[]}
        />
      )} */}
      {!saleId && (
        <SaleFormAdd
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          isLoading={isLoading}
          products={products}
          clients={clients}
          paymentMethods={paymentMethods}
        />
      )}
    </>
  )
}

export default SaleForm
