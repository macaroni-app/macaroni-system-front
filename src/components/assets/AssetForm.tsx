// libs
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { SubmitHandler } from "react-hook-form"

// types
import { IAssetLessCategory, IAssetFullCategory } from "./types"

// components
import AssetAddEditForm from "./AssetAddEditForm"

// custom hooks
import { useAssets } from "../../hooks/useAssets"
import { useCategories } from "../../hooks/useCategories"
import { useNewAsset } from "../../hooks/useNewAsset"
import { useEditAsset } from "../../hooks/useEditAsset"
import { useMessage } from "../../hooks/useMessage"
import { Error, useError } from "../../hooks/useError"

// utils
import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

const AssetForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { throwError } = useError()
  const { showMessage } = useMessage()

  const navigate = useNavigate()

  const { assetId } = useParams()

  const queryAssets = useAssets({ id: assetId })
  const assetToUpdate = queryAssets?.data
    ? ({ ...queryAssets?.data[0] } as IAssetFullCategory)
    : {}

  const categories = useCategories({})?.data

  const { addNewAsset } = useNewAsset()
  const { editAsset } = useEditAsset()

  const onSubmit: SubmitHandler<IAssetLessCategory> = async (
    asset: IAssetLessCategory
  ) => {
    setIsLoading(true)
    try {
      let response
      if (!assetId) {
        response = await addNewAsset({ ...asset })
        if (response.isStored) {
          showMessage(
            RECORD_CREATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      } else {
        response = await editAsset({ assetId, assetToUpdate: asset })
        if (response.isUpdated) {
          showMessage(
            RECORD_UPDATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      }
      if (response.status === 200 || response.status === 201) {
        navigate("/assets")
      }
    } catch (error: unknown) {
      throwError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const onCancelOperation = (): void => {
    navigate("/assets")
  }

  return (
    <AssetAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={onCancelOperation}
      assetToUpdate={assetId ? assetToUpdate : undefined}
      isEditing={assetId ? true : false}
      isLoading={isLoading}
      categories={categories}
    />
  )
}

export default AssetForm
