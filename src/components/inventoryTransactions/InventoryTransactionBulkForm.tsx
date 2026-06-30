import { useState } from "react";

import { useNavigate } from "react-router-dom";

// types
import { IInventoryTransactionLessRelatedBulk, TransactionType } from "./types";

// components
import InventoryTransactionAddBulkForm from "./InventoryTransactionAddBulk";

// custom hooks
import { useInventories } from "../../hooks/useInventories";
import { useNewManyInventoryTransaction } from "../../hooks/useNewManyInventoryTransaction";
import { useMessage } from "../../hooks/useMessage";

// messages
import { Error, useError } from "../../hooks/useError";
import { RECORD_CREATED } from "../../utils/constants";
import { AlertColorScheme, AlertStatus } from "../../utils/enums";
import { useAdjustManyInventory } from "../../hooks/useAdjustManyInventory";
import { getInventoryDisplayName } from "../../utils/variants";
import { IInventoryFullRelated } from "../inventories/types";
import { InventoryOption } from "./InventoryTransactionForm";

const InventoryTransactionBulkForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { throwError } = useError();

  const { showMessage } = useMessage();

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

  const { adjustManyInventory } = useAdjustManyInventory();

  const { addNewManyInventoryTransaction } = useNewManyInventoryTransaction();

  const navigate = useNavigate();

  const onSubmit = async (
    inventoryTransactions: IInventoryTransactionLessRelatedBulk,
  ) => {
    setIsLoading(true);
    try {
      let adjustments: Array<{
        id?: string;
        asset?: string;
        assetVariant?: string;
        quantityDelta: number;
      }> = [];

      inventoryTransactions.inventoryTransactions.forEach(
        (inventoryTransaction) => {
          const selectedInventory = inventories?.find(
            (inventory) => inventory._id === inventoryTransaction.asset,
          );
          if (!selectedInventory) return;

          const baseAssetId = selectedInventory.asset?._id;
          const assetVariantId = selectedInventory.assetVariant?._id;

          inventoryTransaction.asset = baseAssetId;
          inventoryTransaction.assetVariant = assetVariantId;
          inventoryTransaction.oldQuantityAvailable = selectedInventory.quantityAvailable;

          let quantityDelta = 0;
          switch (inventoryTransaction.transactionType) {
            case TransactionType.DOWN: {
              quantityDelta = -Number(inventoryTransaction.affectedAmount);
              break;
            }
            case TransactionType.UP: {
              quantityDelta = Number(inventoryTransaction.affectedAmount);
              break;
            }
          }

          inventoryTransaction.currentQuantityAvailable =
            (selectedInventory.quantityAvailable ?? 0) + quantityDelta;
          inventoryTransaction.unitCost =
            selectedInventory.assetVariant?.costPrice ??
            selectedInventory.asset?.costPrice;

          adjustments.push({
            id: selectedInventory._id,
            asset: baseAssetId,
            assetVariant: assetVariantId,
            quantityDelta,
          });
        },
      );

      const response = await adjustManyInventory(adjustments);

      const updatedInventories = response?.data?.updated ?? [];
      const updatedInventoryById = new Map<string, any>();

      updatedInventories.forEach((inventoryUpdated: any) => {
        if (inventoryUpdated.id) {
          updatedInventoryById.set(
            String(inventoryUpdated.id),
            inventoryUpdated,
          );
        }
      });

      inventoryTransactions.inventoryTransactions.forEach(
        (inventoryTransaction, index) => {
          const adjustment = adjustments[index];
          const updatedInv = adjustment?.id
            ? updatedInventoryById.get(String(adjustment.id))
            : undefined;

          if (updatedInv !== undefined) {
            inventoryTransaction.oldQuantityAvailable =
              updatedInv.oldQuantityAvailable ??
              inventoryTransaction.oldQuantityAvailable;
            inventoryTransaction.currentQuantityAvailable =
              updatedInv.currentQuantityAvailable ??
              updatedInv.quantityAvailable ??
              inventoryTransaction.currentQuantityAvailable;
          }
        },
      );

      if (response.isUpdated && response.status === 200) {
        const response = await addNewManyInventoryTransaction(
          inventoryTransactions.inventoryTransactions,
        );

        if (response.status === 200 || response.status === 201) {
          if (response.isStored) {
            showMessage(
              RECORD_CREATED,
              AlertStatus.Success,
              AlertColorScheme.Purple,
            );
          }

          navigate("/inventoryTransactions");
        }
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
    <InventoryTransactionAddBulkForm
      onSubmit={onSubmit}
      onCancelOperation={onCancelOperation}
      isEditing={false}
      isLoading={isLoading}
      inventoryOptions={inventoryOptions}
    />
  );
};

export default InventoryTransactionBulkForm;
