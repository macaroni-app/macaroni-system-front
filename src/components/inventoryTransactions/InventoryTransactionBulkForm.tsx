import { useState } from "react"

import { useNavigate } from "react-router-dom"

// types
import { IInventoryTransactionLessRelatedBulk, TransactionType } from "./types"
import { IAssetFullCategory } from "../assets/types"
import { IInventoryFullRelated, IInventoryLessRelated } from "../inventories/types"


// components
import InventoryTransactionAddBulkForm from "./InventoryTransactionAddBulk"

// custom hooks
import { useAssets } from "../../hooks/useAssets"
import { useInventories } from "../../hooks/useInventories"
import { useNewManyInventoryTransaction } from "../../hooks/useNewManyInventoryTransaction"
import { useMessage } from "../../hooks/useMessage"


// messages
import { Error, useError } from "../../hooks/useError"
import { RECORD_CREATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import { useEditManyInventory } from "../../hooks/useEditManyInventory"


const InventoryTransactionBulkForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { throwError } = useError()

  const { showMessage } = useMessage()

  const queryInventories = useInventories({})
  const inventories = queryInventories.data as IInventoryFullRelated[]

  const queryAssets = useAssets({})
  const assets = queryAssets?.data as IAssetFullCategory[]

  const { editManyInventory } = useEditManyInventory()

  const { addNewManyInventoryTransaction } = useNewManyInventoryTransaction()

  const navigate = useNavigate()

  const onSubmit = async (
    inventoryTransactions: IInventoryTransactionLessRelatedBulk
  ) => {


    setIsLoading(true)
    try {

      // Todo: actualizar el inventario de cada insumo.

      let inventoriesToUpdate: IInventoryLessRelated[] = []

      inventoryTransactions.inventoryTransactions.forEach((inventoryTransaction) => {
        inventories.forEach((inventory) => {
          let inventoryUpdated: IInventoryLessRelated = {
            asset: inventory.asset?._id,
            id: inventory._id,
            quantityAvailable: inventory.quantityAvailable,
          }
          if (inventoryTransaction.asset === inventory.asset?._id) {

            inventoryTransaction.oldQuantityAvailable = inventory.quantityAvailable

            switch (inventoryTransaction.transactionType) {
              case TransactionType.DOWN: {
                inventoryUpdated.quantityAvailable =
                  inventoryUpdated.quantityAvailable !== undefined
                    ? inventoryUpdated.quantityAvailable - Number(inventoryTransaction.affectedAmount)
                    : inventoryUpdated.quantityAvailable
                break
              }
              case TransactionType.UP: {
                inventoryUpdated.quantityAvailable =
                  inventoryUpdated.quantityAvailable !== undefined
                    ? inventoryUpdated.quantityAvailable + Number(inventoryTransaction.affectedAmount)
                    : inventoryUpdated.quantityAvailable
                break
              }
            }
            inventoryTransaction.currentQuantityAvailable = inventoryUpdated.quantityAvailable

            inventoriesToUpdate.push(inventoryUpdated)
          }
        })
      })

      const response = await editManyInventory(inventoriesToUpdate)

      if (response.isUpdated && response.status === 200) {

        // Todo: registrar las transacciones del inventario de cada insumo.

        const response = await addNewManyInventoryTransaction(inventoryTransactions.inventoryTransactions)

        if (response.status === 200 || response.status === 201) {

          if (response.isStored) {
            showMessage(
              RECORD_CREATED,
              AlertStatus.Success,
              AlertColorScheme.Purple
            )
          }

          navigate("/inventoryTransactions")
        }
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
    <InventoryTransactionAddBulkForm
      onSubmit={onSubmit}
      onCancelOperation={onCancelOperation}
      isEditing={false}
      isLoading={isLoading}
      assets={assets}
    />
  )
}

export default InventoryTransactionBulkForm
