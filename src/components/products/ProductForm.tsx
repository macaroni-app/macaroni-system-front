import { useState } from "react"

import { SubmitHandler } from "react-hook-form"

import { useNavigate, useParams } from "react-router-dom"

// types
import {
  IProductItemOmitProduct,
  IProductFullRelated,
  IProductLessRelated,
  IProductItemLessRelated,
} from "./types"
import { ICategory } from "../categories/types"
import { IProductTypeType } from "../productTypes/types"
import { IAssetFullCategory } from "../assets/types"

// components
import ProductAddForm from "./ProductAddForm"
import ProductFormEdit from "./ProductEditForm"

// custom hooks
import { useProducts } from "../../hooks/useProducts"
import { useNewProduct } from "../../hooks/useNewProduct"
import { useEditProduct } from "../../hooks/useEditProduct"
import { useCategories } from "../../hooks/useCategories"
import { useProductTypes } from "../../hooks/useProductTypes"
import { useAssets } from "../../hooks/useAssets"
import { useProductItems } from "../../hooks/useProductItems"
import { useNewManyProductItem } from "../../hooks/useNewManyProductItem"
import { useEditManyProductItem } from "../../hooks/useEditManyProductItem"
import { useMessage } from "../../hooks/useMessage"
import { useError, Error } from "../../hooks/useError"

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

type IProductResponse = {
  data?: IProductFullRelated
  isStored?: boolean
  isUpdated?: boolean
  status?: number
}

const ProductForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { showMessage } = useMessage()

  const { throwError } = useError()

  const navigate = useNavigate()

  const { productId } = useParams()

  // products
  const queryProducts = useProducts({})
  const queryAssets = useAssets({})
  const queryProductItems = useProductItems({})

  const { addNewProduct } = useNewProduct()
  const { addNewManyProductItem } = useNewManyProductItem()
  const { editProduct } = useEditProduct()
  const { editManyProductItem } = useEditManyProductItem()

  const queryCategories = useCategories({})
  const queryProductTypes = useProductTypes({})

  const categories = queryCategories?.data as ICategory[]
  const productTypes = queryProductTypes?.data as IProductTypeType[]
  const assets = queryAssets?.data as IAssetFullCategory[]
  const productItems = queryProductItems.data as IProductItemLessRelated[]

  const onSubmit: SubmitHandler<IProductLessRelated> = async (
    product: IProductLessRelated
  ) => {
    setIsLoading(true)
    try {
      let response: IProductResponse = {
        data: undefined,
        isStored: undefined,
        status: undefined,
      }

      if (!productId) {
        let assetIds = product?.productItems?.map(
          (productItem) => productItem.asset
        )

        let assetWithCostPrice: IAssetFullCategory[] = []

        assetIds?.forEach((assetId) =>
          assets.forEach((asset) => {
            if (asset._id === assetId) {
              assetWithCostPrice.push(asset)
            }
          })
        )

        let assetWithQuantity: IProductItemOmitProduct[] = []

        assetWithCostPrice.forEach((asset) => {
          product.productItems?.forEach((productItem) => {
            if (asset._id === productItem.asset) {
              assetWithQuantity.push({
                asset,
                quantity: productItem.quantity,
              })
            }
          })
        })

        let totalCost = assetWithQuantity
          ?.map((assetWithQ) => {
            if (
              assetWithQ.asset?.costPrice !== undefined &&
              assetWithQ.quantity !== undefined
            ) {
              return assetWithQ?.asset?.costPrice * Number(assetWithQ?.quantity)
            }
          })
          .reduce((acc, currentValue) => {
            if (acc !== undefined && currentValue !== undefined) {
              return acc + currentValue
            }
          }, 0)

        response = await addNewProduct({ ...product, costPrice: totalCost })

        let producItemWithProduct = product?.productItems?.map(
          (productItem) => {
            return { ...productItem, product: response?.data?._id }
          }
        )

        await addNewManyProductItem(
          producItemWithProduct as IProductItemLessRelated[]
        )

        if (response.isStored) {
          showMessage(
            RECORD_CREATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      } else {
        let assetIds = product?.productItems?.map(
          (productItem) => productItem.asset
        )

        let assetWithCostPrice: IAssetFullCategory[] = []

        assetIds?.forEach((assetId) =>
          assets.forEach((asset) => {
            if (asset._id === assetId) {
              assetWithCostPrice.push(asset)
            }
          })
        )

        let assetWithQuantity: IProductItemOmitProduct[] = []

        assetWithCostPrice.forEach((asset) => {
          product.productItems?.forEach((productItem) => {
            if (asset._id === productItem.asset) {
              assetWithQuantity.push({
                asset,
                quantity: productItem.quantity,
              })
            }
          })
        })

        let totalCost = assetWithQuantity
          ?.map((assetWithQ) => {
            if (
              assetWithQ.asset?.costPrice !== undefined &&
              assetWithQ.quantity !== undefined
            ) {
              return assetWithQ?.asset?.costPrice * Number(assetWithQ?.quantity)
            }
          })
          .reduce((acc, currentValue) => {
            if (acc !== undefined && currentValue !== undefined) {
              return acc + currentValue
            }
          }, 0)

        response = await editProduct({
          productId,
          productToUpdate: { ...product, costPrice: totalCost },
        })

        let newProductItemWithProduct: IProductItemLessRelated[] = []
        let productItemsWithProductToUpdate: IProductItemLessRelated[] = []

        product?.productItems?.forEach((productItem) => {
          if (productItem.hasOwnProperty("id")) {
            productItemsWithProductToUpdate.push({
              ...productItem,
              product: productId,
            })
          }
        })

        product?.productItems?.forEach((productItem) => {
          if (!productItem.hasOwnProperty("id")) {
            newProductItemWithProduct.push({
              ...productItem,
              product: productId,
            })
          }
        })

        if (productItemsWithProductToUpdate.length > 0) {
          await editManyProductItem(
            productItemsWithProductToUpdate as IProductItemLessRelated[]
          )
        }

        if (newProductItemWithProduct.length > 0) {
          await addNewManyProductItem(
            newProductItemWithProduct as IProductItemLessRelated[]
          )
        }

        if (response.isUpdated) {
          showMessage(
            RECORD_UPDATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
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
      {productId && (
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
          assets={assets?.filter((asset) => asset.isActive)}
          productItems={productItems as IProductFullRelated[]}
        />
      )}
      {!productId && (
        <ProductAddForm
          onSubmit={onSubmit}
          onCancelOperation={onCancelOperation}
          isLoading={isLoading}
          categories={categories}
          productTypes={productTypes}
          assets={assets?.filter((asset) => asset.isActive)}
        />
      )}
    </>
  )
}

export default ProductForm
