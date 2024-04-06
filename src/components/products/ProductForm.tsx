import { useState } from "react"

import { SubmitHandler } from "react-hook-form"

import { useNavigate, useParams } from "react-router-dom"

// types
import { IProductComplete } from "./types"
import { ICategory } from "../categories/types"
import { IProductTypeType } from "../productTypes/types"
import { IAsset } from "../assets/types"

// components
import ProductAddForm from "./ProductAddForm"
// import SaleFormEdit from "./SaleFormEdit"

// custom hooks
// import { useProducts } from "../../hooks/useProducts"
import { useNewProduct } from "../../hooks/useNewProduct"
import { useCategories } from "../../hooks/useCategories"
import { useProductTypes } from "../../hooks/useProductTypes"
import { useAssets } from "../../hooks/useAssets"

import { useMessage } from "../../hooks/useMessage"
import { useError, Error } from "../../hooks/useError"

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import { useNewManyProductItem } from "../../hooks/useNewManyProductItem"

const ProductForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { showMessage } = useMessage()

  const { throwError } = useError()

  const navigate = useNavigate()

  const { productId } = useParams()

  // products
  // const queryProducts = useProducts({})
  const queryAssets = useAssets({})

  const { addNewProduct } = useNewProduct()
  const { addNewManyProductItem } = useNewManyProductItem()

  const queryCategories = useCategories({})
  const queryProductTypes = useProductTypes({})

  const categories = queryCategories?.data as ICategory[]
  const productTypes = queryProductTypes?.data as IProductTypeType[]
  const assets = queryAssets?.data as IAsset[]

  //const onSubmit = async () => {
  // setIsLoading(true)
  // let newSale = {
  //   client,
  //   methodPayment,
  //   isPaid,
  // }
  // try {
  //   let response
  //   if (!saleId) {
  //     // insert
  //     let productWithSalePrice = []
  //     let productIds = saleItems?.map((saleItem) => saleItem.product)
  //     let productsToUpdate = []
  //     queryProducts?.data.forEach((p) => {
  //       if (productIds.includes(p._id)) {
  //         productsToUpdate.push({ id: p._id, stock: p.stock })
  //         productWithSalePrice.push({ id: p._id, salePrice: p.salePrice })
  //       }
  //     })
  //     productsToUpdate?.map((productToupdate) => {
  //       saleItems.forEach((saleItem) => {
  //         if (saleItem.product === productToupdate.id) {
  //           productToupdate.stock = productToupdate.stock - saleItem.quantity
  //         }
  //       })
  //     })
  //     saleItems.map((saleItem) => {
  //       productWithSalePrice.forEach((product) => {
  //         if (product.id === saleItem.product) {
  //           saleItem.subtotal = saleItem.quantity * product.salePrice
  //         }
  //       })
  //     })
  //     newSale.total = Number.parseFloat(
  //       saleItems
  //         ?.map((saleItem) => saleItem.subtotal)
  //         .reduce((acc, currentValue) => acc + currentValue, 0)
  //         .toFixed(2)
  //     )
  //     const { data, isStored, status } = await addNewSale(newSale)
  //     let saleItemWithSale = undefined
  //     if (isStored && status === 201 && data) {
  //       if (!isPaid) {
  //         let newDebt = {
  //           client,
  //           sale: data._id,
  //           initialAmount: newSale.total,
  //           deliveredAmount: 0,
  //           isPaid: false,
  //         }
  //         await addNewDebt(newDebt)
  //       }
  //       saleItemWithSale = saleItems.map((saleItem) => {
  //         return { ...saleItem, sale: data._id }
  //       })
  //       const { isStored, status } = await addManySaleDetails({
  //         saleDetails: saleItemWithSale,
  //       })
  //       if (isStored && status === 201) {
  //         response = await updateManyProducts({
  //           products: productsToUpdate,
  //         })
  //         if (response.isUpdated && response.status === 200) {
  //           showMessage(RECORD_CREATED, "success", "purple")
  //         }
  //       }
  //     }
  //   } else {
  //     // update
  //     let productWithSalePrice = []
  //     let oldSaleItems = []
  //     querySaleDetails?.data?.forEach((saleDetail) => {
  //       if (saleDetail.sale === saleId) {
  //         oldSaleItems.push({
  //           product: saleDetail.product._id,
  //           quantity: saleDetail.quantity,
  //           id: saleDetail._id,
  //         })
  //       }
  //     })
  //     let oldProductIds = oldSaleItems?.map(
  //       (oldSaleItem) => oldSaleItem.product
  //     )
  //     let oldProductsToUpdate = []
  //     queryProducts?.data.forEach((p) => {
  //       if (oldProductIds.includes(p._id)) {
  //         oldProductsToUpdate.push({ id: p._id, stock: p.stock })
  //       }
  //     })
  //     oldProductsToUpdate?.map((productToupdate) => {
  //       oldSaleItems.forEach((oldSaleItem) => {
  //         if (oldSaleItem.product === productToupdate.id) {
  //           productToupdate.stock =
  //             productToupdate.stock + oldSaleItem.quantity
  //         }
  //       })
  //     })
  //     const res = await updateManyProducts({
  //       products: oldProductsToUpdate,
  //     })
  //     let productIds = saleItems?.map((saleItem) => saleItem.product)
  //     let productsToUpdate = []
  //     if (res.isUpdated) {
  //       queryProducts?.data.forEach((p) => {
  //         if (productIds.includes(p._id)) {
  //           productsToUpdate.push({ id: p._id, stock: p.stock })
  //           productWithSalePrice.push({ id: p._id, salePrice: p.salePrice })
  //         }
  //       })
  //       productsToUpdate?.map((productToupdate) => {
  //         oldSaleItems.forEach((oldSaleItem) => {
  //           if (oldSaleItem.product === productToupdate.id) {
  //             productToupdate.stock =
  //               productToupdate.stock + oldSaleItem.quantity
  //           }
  //         })
  //       })
  //       productsToUpdate?.map((productToupdate) => {
  //         saleItems.forEach((saleItem) => {
  //           if (saleItem.product === productToupdate.id) {
  //             productToupdate.stock =
  //               productToupdate.stock - saleItem.quantity
  //           }
  //         })
  //       })
  //     }
  //     saleItems.map((saleItem) => {
  //       productWithSalePrice.forEach((product) => {
  //         if (product.id === saleItem.product) {
  //           saleItem.subtotal = saleItem.quantity * product.salePrice
  //         }
  //       })
  //     })
  //     newSale.total = Number.parseFloat(
  //       saleItems
  //         ?.map((saleItem) => saleItem.subtotal)
  //         .reduce((acc, currentValue) => acc + currentValue, 0)
  //         .toFixed(2)
  //     )
  //     const { data, status, isUpdated } = await updateSale({
  //       saleId,
  //       saleToUpdate: newSale,
  //     })
  //     let saleItemWithSale = []
  //     let newSaleItems = []
  //     if (isUpdated && status === 200 && data) {
  //       saleItems.forEach((saleItem) => {
  //         if (saleItem.hasOwnProperty("id")) {
  //           saleItemWithSale.push({ ...saleItem, sale: data._id })
  //         }
  //       })
  //       saleItems.forEach((saleItem) => {
  //         if (!saleItem.hasOwnProperty("id")) {
  //           newSaleItems.push({ ...saleItem, sale: data._id })
  //         }
  //       })
  //       let debtToUpdate = {
  //         ...queryDebts?.data?.filter(
  //           (debt) => debt.sale._id === data._id
  //         )[0],
  //       }
  //       if (!isPaid && JSON.stringify(debtToUpdate) !== "{}") {
  //         debtToUpdate.initialAmount = newSale.total
  //         debtToUpdate.deliveredAmount = 0
  //         debtToUpdate.isPaid = false
  //         await updateDebt({ debtId: debtToUpdate._id, debtToUpdate })
  //       } else if (!isPaid) {
  //         let newDebt = {
  //           client,
  //           sale: data._id,
  //           initialAmount: newSale.total,
  //           deliveredAmount: 0,
  //           isPaid: false,
  //         }
  //         await addNewDebt(newDebt)
  //       } else if (isPaid && JSON.stringify(debtToUpdate) !== "{}") {
  //         debtToUpdate.initialAmount = newSale.total
  //         debtToUpdate.deliveredAmount = newSale.total
  //         debtToUpdate.isPaid = true
  //         await updateDebt({ debtId: debtToUpdate._id, debtToUpdate })
  //       }
  //       const { isUpdated } = await updateManySaleDetails({
  //         saleDetails: saleItemWithSale,
  //       })
  //       if (isUpdated) {
  //         response = await addManySaleDetails({
  //           saleDetails: newSaleItems,
  //         })
  //         if (response.isStored) {
  //           await updateManyProducts({
  //             products: productsToUpdate,
  //           })
  //           showMessage(RECORD_UPDATED, "success", "purple")
  //         }
  //       }
  //     }
  //   }
  //   if (response.status === 200 || response.status === 201) {
  //     window.localStorage.setItem(
  //       "filters",
  //       JSON.stringify({
  //         startDate: today,
  //         endDate: today,
  //       })
  //     )
  //     navigate("/")
  //   }
  // } catch (error) {
  //   throwError(error)
  // } finally {
  //   setIsLoading(false)
  // }
  //}

  const onSubmit: SubmitHandler<IProductComplete> = async (
    product: IProductComplete
  ) => {
    setIsLoading(true)
    try {
      console.log(product)
      let response
      if (!productId) {
        response = await addNewProduct({ ...product })

        let producItemWithProduct = product?.productItems?.map(
          (productItem) => {
            return { ...productItem, product: response?.data._id }
          }
        )

        console.log(producItemWithProduct)
        const { isStored } = await addNewManyProductItem(producItemWithProduct)

        // const { isStored, status } = await addManySaleDetails({
        //   saleDetails: saleItemWithSale,
        // })
        // if (isStored && status === 201) {
        //   response = await updateManyProducts({
        //     products: productsToUpdate,
        //   })
        //   if (response.isUpdated && response.status === 200) {
        //     showMessage(RECORD_CREATED, "success", "purple")
        //   }
        // }

        // if (response.isStored) {
        //   showMessage(
        //     RECORD_CREATED,
        //     AlertStatus.Success,
        //     AlertColorScheme.Purple
        //   )
        // }
      } else {
        // response = await editAsset({ assetId, assetToUpdate: asset })
        // if (response.isUpdated) {
        //   showMessage(
        //     RECORD_UPDATED,
        //     AlertStatus.Success,
        //     AlertColorScheme.Purple
        //   )
        // }
      }
      if (response.status === 200 || response.status === 201) {
        navigate("/products")
      }
    } catch (error: unknown) {
      throwError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const onCancelOperation = () => {
    navigate("/products")
  }

  return (
    <>
      {/* {productId && (
        <SaleFormEdit
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          productToUpdate={{
            ...queryProducts?.data?.find((s) => s._id === productId),
          }}
          isLoading={isLoading}
        />
      )} */}
      {!productId && (
        <ProductAddForm
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          isLoading={isLoading}
          categories={categories}
          productTypes={productTypes}
          assets={assets}
        />
      )}
    </>
  )
}

export default ProductForm
