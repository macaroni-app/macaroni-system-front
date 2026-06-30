import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMessage } from "../../hooks/useMessage"
import { useError } from "../../hooks/useError"
import type { Error } from "../../hooks/useError"
import { useAssetVariants } from "../../hooks/useAssetVariants"
import { useAssets } from "../../hooks/useAssets"
import { useVariantAttributeValues } from "../../hooks/useVariantAttributeValues"
import { useNewAssetVariant } from "../../hooks/useNewAssetVariant"
import { useEditAssetVariant } from "../../hooks/useEditAssetVariant"
import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import AssetVariantAddEditForm from "./AssetVariantAddEditForm"
import { IAssetVariant } from "./types"

const AssetVariantForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { assetVariantId } = useParams()
  const { showMessage } = useMessage()
  const { throwError } = useError()
  const queryAssetVariants = useAssetVariants({ id: assetVariantId })
  const queryAssets = useAssets({})
  const queryVariantAttributeValues = useVariantAttributeValues({})
  const assetVariantToUpdate = queryAssetVariants.data
    ? { ...queryAssetVariants.data[0] }
    : {}
  const { addNewAssetVariant } = useNewAssetVariant()
  const { editAssetVariant } = useEditAssetVariant()

  const onSubmit = async (payload: IAssetVariant) => {
    setIsLoading(true)
    try {
      let response
      if (!assetVariantId) {
        response = await addNewAssetVariant(payload)
        if (response.isStored) {
          showMessage(RECORD_CREATED, AlertStatus.Success, AlertColorScheme.Purple)
        }
      } else {
        response = await editAssetVariant({
          assetVariantId,
          assetVariantToUpdate: payload,
        })
        if (response.isUpdated) {
          showMessage(RECORD_UPDATED, AlertStatus.Success, AlertColorScheme.Purple)
        }
      }
      if (response.status === 200 || response.status === 201) {
        navigate("/assetVariants")
      }
    } catch (error: unknown) {
      throwError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AssetVariantAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={() => navigate("/assetVariants")}
      assetVariantToUpdate={assetVariantId ? assetVariantToUpdate : {}}
      assets={queryAssets.data?.filter((asset) => asset.isActive)}
      values={queryVariantAttributeValues.data?.filter((value) => value.isActive)}
      isEditing={Boolean(assetVariantId)}
      isLoading={isLoading}
    />
  )
}

export default AssetVariantForm
