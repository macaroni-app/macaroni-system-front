import { useState } from "react"

import { useNavigate, useParams } from "react-router-dom"

// types
import { IInventoryLessRelated } from "./types"
import { IAssetFullCategory } from "../assets/types"

// components
import InventoryAddEditForm from "./InventoryAddEditForm"

// custom hooks
import { useInventories } from "../../hooks/useInventories"
import { useAssets } from "../../hooks/useAssets"
import { useNewInventory } from "../../hooks/useNewInventory"
import { useEditInventory } from "../../hooks/useEditInventory"
import { useMessage } from "../../hooks/useMessage"
import { Error, useError } from "../../hooks/useError"

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

const InventoryForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { throwError } = useError()

  const { showMessage } = useMessage()

  const navigate = useNavigate()

  const { inventoryId } = useParams()

  const queryAssets = useAssets({})
  const assets = queryAssets?.data as IAssetFullCategory[]

  const queryInventories = useInventories({ id: inventoryId })
  const inventoryToUpdate = queryInventories?.data
    ? { ...queryInventories?.data[0] }
    : {}

  const assetOnInventory = queryInventories.data?.map(
    (inventory) => inventory.asset?._id
  )
  const assetsFiltered: IAssetFullCategory[] = []

  // para filtrar los assets que ya tiene inventario
  // solo se puede crear inventarios que no tengan aun inventario
  assets?.forEach((asset) => {
    if (!assetOnInventory?.includes(asset?._id)) {
      assetsFiltered.push(asset)
    }
  })

  const { addNewInventory } = useNewInventory()
  const { editInventory } = useEditInventory()

  const onSubmit = async (inventory: IInventoryLessRelated) => {
    setIsLoading(true)

    try {
      let response
      if (!inventoryId) {
        response = await addNewInventory(inventory)
        if (response.isStored) {
          showMessage(
            RECORD_CREATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      } else {
        response = await editInventory({
          inventoryId,
          inventoryToUpdate: { ...inventory },
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
        navigate("/inventories")
      }
    } catch (error: unknown) {
      throwError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const onCancelOperation = () => {
    navigate("/inventories")
  }

  return (
    <InventoryAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={onCancelOperation}
      inventoryToUpdate={inventoryId ? inventoryToUpdate : {}}
      isEditing={inventoryId ? true : false}
      isLoading={isLoading}
      assets={assets}
    />
  )
}

export default InventoryForm
