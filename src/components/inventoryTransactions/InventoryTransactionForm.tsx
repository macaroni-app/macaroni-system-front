import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

// types
import { IInventoryTransactionLessRelated, TransactionType } from "./types";
import { IAssetFullCategory } from "../assets/types";

// components
import InventoryTransactionAddEditForm from "./InventoryTransactionAddEditForm";

// custom hooks
import { useInventoryTransactions } from "../../hooks/useInventoryTransactions";
import { useAssets } from "../../hooks/useAssets";
import { useNewInventoryTransaction } from "../../hooks/useNewInventoryTransaction";
import { useEditInventoryTransaction } from "../../hooks/useEditInventoryTransaction";
import { useAdjustManyInventory } from "../../hooks/useAdjustManyInventory";

import { useMessage } from "../../hooks/useMessage";
import { useError } from "../../hooks/useError";

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants";
import { AlertColorScheme, AlertStatus } from "../../utils/enums";
// IInventoryFullRelated not needed directly here; using inventoriesByAsset map from hook
import { useInventories } from "../../hooks/useInventories";

const InventoryTransactionForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { throwError } = useError();

  const { showMessage } = useMessage();

  const navigate = useNavigate();

  const { inventoryTransactionId } = useParams();

  const { adjustManyInventory } = useAdjustManyInventory();

  const queryInventories = useInventories({});
  const inventoriesByAsset = queryInventories.inventoriesByAssetId;

  const queryAssets = useAssets({});
  const assets = queryAssets?.data as IAssetFullCategory[];

  const queryInventoryTransactions = useInventoryTransactions({
    id: inventoryTransactionId,
  });
  const inventoryTransactionToUpdate = queryInventoryTransactions?.data
    ? { ...queryInventoryTransactions?.data[0] }
    : {};

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

  const { addNewInventoryTransaction } = useNewInventoryTransaction();
  const { editInventoryTransaction } = useEditInventoryTransaction();

  const onSubmit = async (
    inventoryTransaction: IInventoryTransactionLessRelated,
  ) => {
    setIsLoading(true);
    try {
      let response;

      if (!inventoryTransactionId) {
        const inv = inventoriesByAsset?.get(
          inventoryTransaction.asset ? inventoryTransaction.asset : "",
        );
        if (!inv) throw new Error("Inventory not found for asset");

        const assetRelated = assets.find(
          (asset) => asset._id === inventoryTransaction.asset,
        );

        const inventoryTransacionToSave: IInventoryTransactionLessRelated = {
          ...inventoryTransaction,
          oldQuantityAvailable: inv.quantityAvailable,
          unitCost: assetRelated?.costPrice,
        };

        const quantityDelta =
          inventoryTransaction.transactionType === TransactionType.UP
            ? Number(inventoryTransaction.affectedAmount)
            : -Number(inventoryTransaction.affectedAmount);

        const adjustments = [
          { id: inv._id, asset: inv.asset?._id, quantityDelta },
        ];

        const editInventoryResponse = await adjustManyInventory(adjustments);

        if (editInventoryResponse?.isUpdated) {
          const updatedInventory = editInventoryResponse?.data?.updated?.[0];

          response = await addNewInventoryTransaction({
            ...inventoryTransacionToSave,
            oldQuantityAvailable:
              updatedInventory?.oldQuantityAvailable ?? inv.quantityAvailable,
            currentQuantityAvailable:
              updatedInventory?.currentQuantityAvailable ??
              updatedInventory?.quantityAvailable ??
              (inv.quantityAvailable ?? 0) + quantityDelta,
          });

          if (response.isStored) {
            showMessage(
              RECORD_CREATED,
              AlertStatus.Success,
              AlertColorScheme.Purple,
            );
          }
        }
      } else {
        response = await editInventoryTransaction({
          inventoryTransactionId,
          inventoryTransactionToUpdate: { ...inventoryTransaction },
        });
        if (response.isUpdated) {
          showMessage(
            RECORD_UPDATED,
            AlertStatus.Success,
            AlertColorScheme.Purple,
          );
        }
      }

      if (response?.status === 200 || response?.status === 201) {
        navigate("/inventoryTransactions");
      }
    } catch (error: unknown) {
      throwError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCancelOperation = () => {
    navigate("/inventoryTransactions");
  };

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
  );
};

export default InventoryTransactionForm;
