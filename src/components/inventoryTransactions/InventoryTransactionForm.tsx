import { useState } from "react"

import { useNavigate, useParams } from "react-router-dom"

// types
import { IInventoryTransactionLessRelated } from "./types"
import { IAssetFullCategory } from "../assets/types"

// components
import InventoryTransactionAddEditForm from "./InventoryTransactionAddEditForm"

// custom hooks
import { useInventoryTransactions } from "../../hooks/useInventoryTransactions"
import { useAssets } from "../../hooks/useAssets"
import { useNewInventoryTransaction } from "../../hooks/useNewInventoryTransaction"
import { useEditInventoryTransaction } from "../../hooks/useEditInventoryTransaction"

import { useMessage } from "../../hooks/useMessage"
import { Error, useError } from "../../hooks/useError"

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

const InventoryTransactionForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { throwError } = useError()

  const { showMessage } = useMessage()

  const navigate = useNavigate()

  const { inventoryTransactionId } = useParams()

  const queryAssets = useAssets({})
  const assets = queryAssets?.data as IAssetFullCategory[]

  const queryInventoryTransactions = useInventoryTransactions({
    id: inventoryTransactionId,
  })
  const inventoryTransactionToUpdate = queryInventoryTransactions?.data
    ? { ...queryInventoryTransactions?.data[0] }
    : {}

  // const assetOnInventory = queryInventoryTransactions.data?.map(
  //   (inventory) => inventory.asset?._id
  // )
  // const assetsFiltered: IAssetFullCategory[] = []

  // para filtrar los assets que ya tiene inventario
  // solo se puede crear inventarios que no tengan aun inventario
  // assets?.forEach((asset) => {
  //   if (!assetOnInventory?.includes(asset?._id)) {
  //     assetsFiltered.push(asset)
  //   }
  // })

  const { addNewInventoryTransaction } = useNewInventoryTransaction()
  const { editInventoryTransaction } = useEditInventoryTransaction()

  const onSubmit = async (
    inventoryTransaction: IInventoryTransactionLessRelated
  ) => {
    setIsLoading(true)
    try {
      let response
      if (!inventoryTransactionId) {
        response = await addNewInventoryTransaction(inventoryTransaction)
        if (response.isStored) {
          showMessage(
            RECORD_CREATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      } else {
        response = await editInventoryTransaction({
          inventoryTransactionId,
          inventoryTransactionToUpdate: { ...inventoryTransaction },
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
        navigate("/inventoryTransactions")
      }
    } catch (error: unknown) {
      throwError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const onCancelOperation = () => {
    navigate("/inventoryTransactions")
  }

  return (
    <InventoryTransactionAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={onCancelOperation}
      inventoryTransactionToUpdate={
        inventoryTransactionId ? inventoryTransactionToUpdate : {}
      }
      isEditing={inventoryTransactionId ? true : false}
      isLoading={isLoading}
      assets={assets}
    />
  )
}

export default InventoryTransactionForm
