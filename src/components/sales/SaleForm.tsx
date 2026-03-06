import { useState } from "react";

import { SubmitHandler } from "react-hook-form";

import { useNavigate, useParams } from "react-router-dom";

// types
import {
  ISaleItemLessRelated,
  ISaleLessRelated,
  ISaleFullRelated,
  SaleStatus,
  ISaleItemOmitSale,
} from "./types";
import { IProductFullRelated } from "../products/types";
import { IClient } from "../clients/types";
import { IPaymentMethod } from "../paymentMethods/types";

// components
import SaleFormAdd from "./SaleAddForm";
// import ProductFormEdit from "./ProductEditForm";

// custom hooks
import { useProducts } from "../../hooks/useProducts";
import { useClients } from "../../hooks/useClients";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";
// removed unused useSaleItems import
// import { useEditManyInventory } from "../../hooks/useEditManyInventory";
import { useAdjustManyInventory } from "../../hooks/useAdjustManyInventory";
import { useMessage } from "../../hooks/useMessage";
import { useError, Error } from "../../hooks/useError";

import { RECORD_CREATED } from "../../utils/constants";
import { AlertColorScheme, AlertStatus } from "../../utils/enums";
import { useProductItems } from "../../hooks/useProductItems";
import { IProductItemFullRelated } from "../products/types";
import { useInventories } from "../../hooks/useInventories";
import { IInventoryFullRelated } from "../inventories/types";
import { useNewManyInventoryTransaction } from "../../hooks/useNewManyInventoryTransaction";
import {
  IInventoryTransactionLessRelated,
  TransactionReason,
  TransactionType,
} from "../inventoryTransactions/types";
import { useNewSale } from "../../hooks/useNewSale";
import { useNewManySaleItem } from "../../hooks/useNewManySaleItem";
import { useBusinesses } from "../../hooks/useBusinesses";
import { IBusiness } from "../businesses/types";

type ISaleResponse = {
  data?: ISaleFullRelated;
  isStored?: boolean;
  isUpdated?: boolean;
  status?: number;
};

const SaleForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { showMessage } = useMessage();

  const { throwError } = useError();

  const navigate = useNavigate();

  const { saleId } = useParams();

  // products
  const queryProducts = useProducts({});
  const queryProductItems = useProductItems({});
  const queryClients = useClients({});
  const queryPaymentMethod = usePaymentMethods({});
  const queryInventories = useInventories({});
  const queryBusinesses = useBusinesses({});

  // const { addNewProduct } = useNewProduct();
  // const { addNewManyProductItem } = useNewManyProductItem();
  // const { editProduct } = useEditProduct();
  // const { editManyProductItem } = useEditManyProductItem();
  const { addNewSale } = useNewSale();
  const { adjustManyInventory } = useAdjustManyInventory();
  const { addNewManyInventoryTransaction } = useNewManyInventoryTransaction();
  const { addNewManySaleItem } = useNewManySaleItem();

  const products = queryProducts.data as IProductFullRelated[];
  const productItems = queryProductItems.data as IProductItemFullRelated[];
  const clients = queryClients.data as IClient[];
  const paymentMethods = queryPaymentMethod.data as IPaymentMethod[];
  // saleItems fetched via query but not used directly here
  const inventories = queryInventories.inventories as IInventoryFullRelated[];
  const inventoriesByAsset = queryInventories.inventoriesByAssetId;
  const businesses = queryBusinesses.data as IBusiness[];
  const currentBusiness = businesses?.find(
    (business) => business?.cuit === "23393153504",
  );

  const productsById = new Map<string, IProductFullRelated>();

  products?.forEach((product) => {
    if (product?._id) productsById.set(product._id, product);
  });

  const getTotalSale = (sale: ISaleLessRelated) => {
    let productIds = sale?.saleItems?.map((saleItem) => saleItem.product);

    let productWithSalePrice: IProductFullRelated[] = [];

    productIds?.forEach((productId) =>
      products?.forEach((product) => {
        if (product._id === productId) {
          productWithSalePrice.push(product);
        }
      }),
    );

    let productWithQuantity: ISaleItemOmitSale[] = [];

    productWithSalePrice.forEach((product) => {
      sale.saleItems?.forEach((saleItem) => {
        if (product._id === saleItem.product) {
          productWithQuantity.push({
            product,
            quantity: saleItem.quantity,
          });
        }
      });
    });

    const totalSale =
      productWithQuantity
        .map((productWithQ) => {
          if (
            productWithQ.product?.retailsalePrice !== undefined &&
            productWithQ.quantity !== undefined
          ) {
            const price = sale.isRetail
              ? Number(productWithQ.product.retailsalePrice)
              : Number(productWithQ.product.wholesalePrice);
            return price * Number(productWithQ.quantity);
          }
          return 0;
        })
        .reduce((acc, current) => acc + (current ?? 0), 0) ?? 0;

    const discount =
      sale?.discount !== undefined && !isNaN(sale?.discount)
        ? sale.discount / 100
        : 0;

    const totalSaleWithDiscount = totalSale - totalSale * discount;

    return totalSaleWithDiscount;
  };

  const onSubmit: SubmitHandler<ISaleLessRelated> = async (
    sale: ISaleLessRelated,
  ) => {
    setIsLoading(true);
    try {
      let response: ISaleResponse = {
        data: undefined,
        isStored: undefined,
        status: undefined,
      };

      if (!saleId) {
        // Todo: actualizar el inventario de cada insumo.
        const assetQuantityByAssetId = new Map<string, number>();

        productItems.forEach((productItem) => {
          // ensure productItem has asset and product
          const assetId = productItem?.asset?._id;
          const productId = productItem?.product?._id;
          if (!assetId || !productId) return;

          sale.saleItems?.forEach((saleItem) => {
            if (
              saleItem.product === productId &&
              saleItem.quantity !== undefined
            ) {
              const addAmount =
                Number(productItem.quantity ?? 0) *
                Number(saleItem.quantity ?? 0);
              const prev = assetQuantityByAssetId.get(assetId) ?? 0;
              assetQuantityByAssetId.set(assetId, prev + addAmount);
            }
          });
        });

        // enviaremos ajustes (deltas) en lugar de cantidades absolutas
        let inventoryAdjustments: Array<{
          id?: string;
          asset?: string;
          quantityDelta: number;
        }> = [];

        // para usar en las transacciones: guardar valores viejos (snapshot)
        const oldInventories: IInventoryFullRelated[] =
          inventories?.map((inv) => ({
            ...inv,
            asset: inv.asset ? { ...inv.asset } : undefined,
          })) ?? [];

        // usar el Map O(1) de inventoriesByAsset
        // (ya está disponible por el hook)

        assetQuantityByAssetId.forEach((value, key) => {
          if (!inventoriesByAsset) return;
          const inv = inventoriesByAsset.get(key);
          if (!inv) return;

          // delta negativo porque estamos descontando stock por una venta
          const quantityDelta = -Number(value);

          inventoryAdjustments.push({
            id: inv._id,
            asset: inv.asset?._id,
            quantityDelta,
          });
        });

        const adjustInventoryResponse =
          inventoryAdjustments.length > 0
            ? await adjustManyInventory(inventoryAdjustments)
            : undefined;

        const updatedInventories = adjustInventoryResponse?.data?.updated ?? [];

        const updatedInventoryById = new Map<string, any>();

        updatedInventories.forEach((inventoryUpdated: any) => {
          if (inventoryUpdated.id) {
            updatedInventoryById.set(
              String(inventoryUpdated.id),
              inventoryUpdated,
            );
          }
        });

        // Todo: registrar las transacciones del inventario de cada insumo.

        let inventoryTransactions: IInventoryTransactionLessRelated[] = [];

        assetQuantityByAssetId.forEach((value, key) => {
          inventoryTransactions.push({
            asset: key,
            affectedAmount: value,
            transactionType: TransactionType.DOWN,
            transactionReason: TransactionReason.SELL,
          });
        });

        // guardar los valores viejos y nuevos
        inventoryTransactions.forEach((inventoryTransaction) => {
          oldInventories.forEach((oldInventory) => {
            if (inventoryTransaction.asset === oldInventory.asset?._id) {
              inventoryTransaction.unitCost = oldInventory.asset?.costPrice;
            }
          });
          inventoryAdjustments.forEach((adj) => {
            if (inventoryTransaction.asset === adj.asset) {
              const oldInv = inventoriesByAsset?.get(String(adj.asset));
              const updatedInv = adj.id
                ? updatedInventoryById.get(String(adj.id))
                : undefined;

              inventoryTransaction.oldQuantityAvailable =
                updatedInv?.oldQuantityAvailable ?? oldInv?.quantityAvailable;
              inventoryTransaction.currentQuantityAvailable =
                updatedInv?.currentQuantityAvailable ??
                updatedInv?.quantityAvailable ??
                (oldInv?.quantityAvailable ?? 0) + adj.quantityDelta;
              inventoryTransaction.unitCost = oldInv?.asset?.costPrice;
            }
          });
        });

        await addNewManyInventoryTransaction(inventoryTransactions);

        // Todo: insertar la venta.

        const costTotal =
          sale.saleItems
            ?.map((saleItem) => {
              if (saleItem.quantity === undefined) return 0;
              const prod = productsById.get(String(saleItem.product));
              if (!prod || prod.costPrice === undefined) return 0;
              return Number(saleItem.quantity) * Number(prod.costPrice);
            })
            .reduce((acc, cur) => acc + (cur ?? 0), 0) ?? 0;

        sale.total = getTotalSale(sale);
        sale.costTotal = costTotal;
        sale.status = SaleStatus.PAID;
        sale.business = currentBusiness?._id;
        response = await addNewSale(sale);

        // Todo: insertar los items de la venta.

        const saleItemWithSale = (sale?.saleItems ?? [])
          .map((saleItem) => {
            const prod = productsById.get(String(saleItem.product));
            if (!prod) return null;

            const qty = Number(saleItem.quantity ?? 0);
            const price = sale.isRetail
              ? prod.retailsalePrice
              : prod.wholesalePrice;
            const subTotal = qty * Number(price ?? 0);

            const discount =
              sale?.discount !== undefined && !isNaN(sale?.discount)
                ? sale.discount / 100
                : 0;

            const subTotalWithDiscount = subTotal - subTotal * discount;

            return {
              ...saleItem,
              sale: response?.data?._id,
              subtotal: subTotalWithDiscount,
            };
          })
          .filter(Boolean) as ISaleItemLessRelated[];

        if (saleItemWithSale.length > 0) {
          await addNewManySaleItem(saleItemWithSale as ISaleItemLessRelated[]);
        }

        if (response.isStored) {
          showMessage(
            RECORD_CREATED,
            AlertStatus.Success,
            AlertColorScheme.Purple,
          );
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
        navigate("/sales");
      }
    } catch (error: unknown) {
      throwError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCancelOperation = () => {
    navigate("/sales");
  };

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
          clients={clients?.filter((client) => client.isActive)}
          paymentMethods={paymentMethods}
        />
      )}
    </>
  );
};

export default SaleForm;
