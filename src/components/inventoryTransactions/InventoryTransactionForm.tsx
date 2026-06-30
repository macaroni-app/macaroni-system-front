import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

// types
import { IInventoryTransactionLessRelated, TransactionType } from "./types";

// components
import InventoryTransactionAddEditForm from "./InventoryTransactionAddEditForm";

// custom hooks
import { useInventoryTransactions } from "../../hooks/useInventoryTransactions";
import { useNewInventoryTransaction } from "../../hooks/useNewInventoryTransaction";
import { useEditInventoryTransaction } from "../../hooks/useEditInventoryTransaction";
import { useAdjustManyInventory } from "../../hooks/useAdjustManyInventory";

import { useMessage } from "../../hooks/useMessage";
import { useError } from "../../hooks/useError";

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants";
import { AlertColorScheme, AlertStatus } from "../../utils/enums";
import { useInventories } from "../../hooks/useInventories";
import { getInventoryDisplayName } from "../../utils/variants";
import { IInventoryFullRelated } from "../inventories/types";

export type InventoryOption = {
  _id: string;
  name: string;
};

const InventoryTransactionForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { throwError } = useError();

  const { showMessage } = useMessage();

  const navigate = useNavigate();

  const { inventoryTransactionId } = useParams();

  const { adjustManyInventory } = useAdjustManyInventory();

  const queryInventories = useInventories({});
  const inventories = queryInventories.inventories as IInventoryFullRelated[];

  const inventoryOptions: InventoryOption[] = (inventories ?? [])
    .filter((inventory) => inventory.asset?.isActive)
    .map((inventory) => ({
      _id: String(inventory._id),
      name: getInventoryDisplayName({
        asset: inventory.asset,
        assetVariant: inventory.assetVariant,
      }),
    }));

  const queryInventoryTransactions = useInventoryTransactions({
    id: inventoryTransactionId,
  });
  const inventoryTransactionToUpdate = queryInventoryTransactions?.data
    ? { ...queryInventoryTransactions?.data[0] }
    : {};

  const { addNewInventoryTransaction } = useNewInventoryTransaction();
  const { editInventoryTransaction } = useEditInventoryTransaction();

  const onSubmit = async (
    inventoryTransaction: IInventoryTransactionLessRelated,
  ) => {
    setIsLoading(true);
    try {
      let response;

      const selectedInventory = inventories?.find(
        (inventory) => inventory._id === inventoryTransaction.asset,
      );

      if (!selectedInventory) {
        throw new Error("No se encontró el inventario seleccionado.");
      }

      const baseAssetId = selectedInventory.asset?._id;
      const assetVariantId = selectedInventory.assetVariant?._id;
      const unitCost =
        selectedInventory.assetVariant?.costPrice ??
        selectedInventory.asset?.costPrice;

      const normalizedInventoryTransaction: IInventoryTransactionLessRelated = {
        ...inventoryTransaction,
        asset: baseAssetId,
        assetVariant: assetVariantId,
      };

      if (!inventoryTransactionId) {
        const inventoryTransacionToSave: IInventoryTransactionLessRelated = {
          ...normalizedInventoryTransaction,
          oldQuantityAvailable: selectedInventory.quantityAvailable,
          unitCost,
        };

        const quantityDelta =
          inventoryTransaction.transactionType === TransactionType.UP
            ? Number(inventoryTransaction.affectedAmount)
            : -Number(inventoryTransaction.affectedAmount);

        const adjustments = [
          {
            id: selectedInventory._id,
            asset: baseAssetId,
            assetVariant: assetVariantId,
            quantityDelta,
          },
        ];

        const editInventoryResponse = await adjustManyInventory(adjustments);

        if (editInventoryResponse?.isUpdated) {
          const updatedInventory = editInventoryResponse?.data?.updated?.[0];

          response = await addNewInventoryTransaction({
            ...inventoryTransacionToSave,
            oldQuantityAvailable:
              updatedInventory?.oldQuantityAvailable ??
              selectedInventory.quantityAvailable,
            currentQuantityAvailable:
              updatedInventory?.currentQuantityAvailable ??
              updatedInventory?.quantityAvailable ??
              (selectedInventory.quantityAvailable ?? 0) + quantityDelta,
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
          inventoryTransactionToUpdate: { ...normalizedInventoryTransaction },
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
      inventoryOptions={inventoryOptions}
      inventories={inventories}
    />
  );
};

export default InventoryTransactionForm;
