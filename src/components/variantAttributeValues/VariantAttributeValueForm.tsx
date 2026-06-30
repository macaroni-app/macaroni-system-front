import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMessage } from "../../hooks/useMessage"
import { useError } from "../../hooks/useError"
import type { Error } from "../../hooks/useError"
import { useVariantAttributeValues } from "../../hooks/useVariantAttributeValues"
import { useVariantAttributes } from "../../hooks/useVariantAttributes"
import { useNewVariantAttributeValue } from "../../hooks/useNewVariantAttributeValue"
import { useEditVariantAttributeValue } from "../../hooks/useEditVariantAttributeValue"
import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import VariantAttributeValueAddEditForm from "./VariantAttributeValueAddEditForm"
import { IVariantAttributeValue } from "./types"

const VariantAttributeValueForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { variantAttributeValueId } = useParams()
  const { showMessage } = useMessage()
  const { throwError } = useError()
  const queryVariantAttributeValues = useVariantAttributeValues({
    id: variantAttributeValueId,
  })
  const queryVariantAttributes = useVariantAttributes({})
  const variantAttributeValueToUpdate = queryVariantAttributeValues.data
    ? { ...queryVariantAttributeValues.data[0] }
    : {}
  const { addNewVariantAttributeValue } = useNewVariantAttributeValue()
  const { editVariantAttributeValue } = useEditVariantAttributeValue()

  const onSubmit = async (payload: IVariantAttributeValue) => {
    setIsLoading(true)
    try {
      let response
      if (!variantAttributeValueId) {
        response = await addNewVariantAttributeValue(payload)
        if (response.isStored) {
          showMessage(RECORD_CREATED, AlertStatus.Success, AlertColorScheme.Purple)
        }
      } else {
        response = await editVariantAttributeValue({
          variantAttributeValueId,
          variantAttributeValueToUpdate: payload,
        })
        if (response.isUpdated) {
          showMessage(RECORD_UPDATED, AlertStatus.Success, AlertColorScheme.Purple)
        }
      }
      if (response.status === 200 || response.status === 201) {
        navigate("/variantAttributeValues")
      }
    } catch (error: unknown) {
      throwError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VariantAttributeValueAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={() => navigate("/variantAttributeValues")}
      variantAttributeValueToUpdate={
        variantAttributeValueId ? variantAttributeValueToUpdate : {}
      }
      attributes={queryVariantAttributes.data}
      isEditing={Boolean(variantAttributeValueId)}
      isLoading={isLoading}
    />
  )
}

export default VariantAttributeValueForm
