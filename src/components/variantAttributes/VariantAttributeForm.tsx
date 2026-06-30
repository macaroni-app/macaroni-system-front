import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMessage } from "../../hooks/useMessage"
import { useError } from "../../hooks/useError"
import type { Error } from "../../hooks/useError"
import { useVariantAttributes } from "../../hooks/useVariantAttributes"
import { useNewVariantAttribute } from "../../hooks/useNewVariantAttribute"
import { useEditVariantAttribute } from "../../hooks/useEditVariantAttribute"
import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import VariantAttributeAddEditForm from "./VariantAttributeAddEditForm"
import { IVariantAttribute } from "./types"

const VariantAttributeForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { variantAttributeId } = useParams()
  const { showMessage } = useMessage()
  const { throwError } = useError()
  const queryVariantAttributes = useVariantAttributes({ id: variantAttributeId })
  const variantAttributeToUpdate = queryVariantAttributes.data
    ? { ...queryVariantAttributes.data[0] }
    : {}
  const { addNewVariantAttribute } = useNewVariantAttribute()
  const { editVariantAttribute } = useEditVariantAttribute()

  const onSubmit = async ({ name }: IVariantAttribute) => {
    setIsLoading(true)
    try {
      let response
      if (!variantAttributeId) {
        response = await addNewVariantAttribute({ name })
        if (response.isStored) {
          showMessage(RECORD_CREATED, AlertStatus.Success, AlertColorScheme.Purple)
        }
      } else {
        response = await editVariantAttribute({
          variantAttributeId,
          variantAttributeToUpdate: { name },
        })
        if (response.isUpdated) {
          showMessage(RECORD_UPDATED, AlertStatus.Success, AlertColorScheme.Purple)
        }
      }
      if (response.status === 200 || response.status === 201) {
        navigate("/variantAttributes")
      }
    } catch (error: unknown) {
      throwError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VariantAttributeAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={() => navigate("/variantAttributes")}
      variantAttributeToUpdate={variantAttributeId ? variantAttributeToUpdate : {}}
      isEditing={Boolean(variantAttributeId)}
      isLoading={isLoading}
    />
  )
}

export default VariantAttributeForm
