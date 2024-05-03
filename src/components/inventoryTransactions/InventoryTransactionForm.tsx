import { useState } from "react"

import { useNavigate, useParams } from "react-router-dom"

// types
import { IInventoryTransactionLessRelated, TransactionType } from "./types"
import { IAssetFullCategory } from "../assets/types"

// components
import InventoryTransactionAddEditForm from "./InventoryTransactionAddEditForm"

// custom hooks
import { useInventoryTransactions } from "../../hooks/useInventoryTransactions"
import { useAssets } from "../../hooks/useAssets"
import { useNewInventoryTransaction } from "../../hooks/useNewInventoryTransaction"
import { useEditInventoryTransaction } from "../../hooks/useEditInventoryTransaction"
import { useEditManyInventory } from "../../hooks/useEditManyInventory"

import { useMessage } from "../../hooks/useMessage"
import { Error, useError } from "../../hooks/useError"

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import {
  IInventoryFullRelated,
  IInventoryLessRelated,
} from "../inventories/types"
import { useInventories } from "../../hooks/useInventories"

const InventoryTransactionForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { throwError } = useError()

  const { showMessage } = useMessage()

  const navigate = useNavigate()

  const { inventoryTransactionId } = useParams()

  const { editManyInventory } = useEditManyInventory()

  const queryInventories = useInventories({})
  const inventories = queryInventories.data as IInventoryFullRelated[]

  const inventoryByAssetId = new Map<string, IInventoryFullRelated>()

  inventories?.forEach((inventory) => {
    if (inventory.asset?._id !== undefined) {
      inventoryByAssetId.set(inventory?.asset?._id, inventory)
    }
  })

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
        // Todo: actualizar el inventario del insumo

        let editInventoryResponse

        let inventory = inventoryByAssetId.get(
          inventoryTransaction.asset ? inventoryTransaction.asset : ""
        )

        let inventoryUpdated: IInventoryLessRelated = {
          asset: inventory?.asset?._id,
          id: inventory?._id,
          quantityAvailable: inventory?.quantityAvailable,
        }

        let inventoriesToUpdate: IInventoryLessRelated[] = []

        if (inventoryTransaction.transactionType === TransactionType.UP) {
          // Todo: si es up hay que aumentar el inventario en la cantidad afectada del insumo
          if (
            inventoryUpdated.quantityAvailable !== undefined &&
            inventoryTransaction.affectedAmount !== undefined
          ) {
            inventoryUpdated.quantityAvailable =
              inventoryUpdated?.quantityAvailable +
              inventoryTransaction?.affectedAmount
          }

          inventoriesToUpdate.push(inventoryUpdated)

          editInventoryResponse = await editManyInventory(inventoriesToUpdate)
        }

        if (inventoryTransaction.transactionType === TransactionType.DOWN) {
          // Todo: si es down hay que disminuir el inventario en la cantidad afectada del insumo
          if (
            inventoryUpdated.quantityAvailable !== undefined &&
            inventoryTransaction.affectedAmount !== undefined
          ) {
            inventoryUpdated.quantityAvailable =
              inventoryUpdated?.quantityAvailable -
              inventoryTransaction?.affectedAmount
          }

          inventoriesToUpdate.push(inventoryUpdated)

          editInventoryResponse = await editManyInventory(inventoriesToUpdate)
        }

        if (editInventoryResponse.isUpdated) {
          response = await addNewInventoryTransaction(inventoryTransaction)

          if (response.isStored) {
            showMessage(
              RECORD_CREATED,
              AlertStatus.Success,
              AlertColorScheme.Purple
            )
          }
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
