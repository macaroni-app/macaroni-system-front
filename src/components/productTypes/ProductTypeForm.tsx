import { useState } from "react"

import { useNavigate, useParams } from "react-router-dom"

// components
import ProductTypeAddEditForm from "./ProductTypeAddEditForm"

// custom hooks
import { useProductTypes } from "../../hooks/useProductTypes"
import { useNewProductType } from "../../hooks/useNewProductType"
import { useEditProductType } from "../../hooks/useEditProductType"
import { useMessage } from "../../hooks/useMessage"
import { Error, useError } from "../../hooks/useError"

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import { IProductTypeType } from "./types"

const ProductTypeForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { throwError } = useError()

  const { showMessage } = useMessage()

  const navigate = useNavigate()

  const { productTypeId } = useParams()

  const queryProductTypes = useProductTypes({ id: productTypeId })
  const productTypeToUpdate = queryProductTypes?.data
    ? { ...queryProductTypes?.data[0] }
    : {}

  const { addNewProductType } = useNewProductType()
  const { editProductType } = useEditProductType()

  const onSubmit = async ({ name }: IProductTypeType) => {
    setIsLoading(true)

    try {
      let response
      if (!productTypeId) {
        response = await addNewProductType({ name })
        if (response.isStored) {
          showMessage(
            RECORD_CREATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      } else {
        response = await editProductType({
          productTypeId,
          productTypeToUpdate: { name },
        })
        if (response.isUpdated) {
          showMessage(
            RECORD_UPDATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      }
      if (response.status === 200 || response.status === 201) {
        navigate("/productTypes")
      }
    } catch (error: unknown) {
      throwError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const onCancelOperation = () => {
    navigate("/productTypes")
  }

  return (
    <ProductTypeAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={onCancelOperation}
      productTypeToUpdate={productTypeId ? productTypeToUpdate : {}}
      isEditing={productTypeId ? true : false}
      isLoading={isLoading}
    />
  )
}

export default ProductTypeForm
