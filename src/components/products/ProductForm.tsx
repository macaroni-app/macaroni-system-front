// libs
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { SubmitHandler } from "react-hook-form"

// types
import { IProduct } from "./types"

// components
import ProductAddEditForm from "./ProductAddEditForm"

// custom hooks
import { useProducts } from "../../hooks/useProducts"
// import { useCategories } from "../../hooks/useCategories"
import { useNewProduct } from "../../hooks/useNewProduct"
import { useEditProduct } from "../../hooks/useEditProduct"
import { useMessage } from "../../hooks/useMessage"
import { Error, useError } from "../../hooks/useError"

// utils
import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

const ProductForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { throwError } = useError()
  const { showMessage } = useMessage()

  const navigate = useNavigate()

  const { productId } = useParams()

  const queryProducts = useProducts({ id: productId })
  const productToUpdate = queryProducts?.data
    ? { ...queryProducts?.data[0] }
    : {}
  // const queryCategories = useCategories()

  const { addNewProduct } = useNewProduct()
  const { editProduct } = useEditProduct()

  const onSubmit: SubmitHandler<IProduct> = async (product: IProduct) => {
    // setIsLoading(true)
    try {
      let response
      if (!productId) {
        response = await addNewProduct({ ...product })
        if (response.isStored) {
          showMessage(
            RECORD_CREATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      } else {
        // productToUpdate.name = name
        // productToUpdate.costPrice = Number.parseFloat(costPrice)
        // productToUpdate.category = category
        // productToUpdate.stock = Number.parseFloat(stock)
        // productToUpdate.salePrice = Number.parseFloat(salePrice)
        // productToUpdate.salePorcentage = (salePrice / costPrice - 1) * 100
        // response = await editProduct({ productId, productToUpdate })
        // if (response.isUpdated) {
        //   showMessage(RECORD_UPDATED, "success", "purple")
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

  const onCancelOperation = (): void => {
    navigate("/products")
  }

  return (
    <ProductAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={onCancelOperation}
      productToUpdate={productToUpdate}
      // categories={queryCategories?.data}
      isEditing={productId ? true : false}
      isLoading={isLoading}
    />
  )
}

export default ProductForm
