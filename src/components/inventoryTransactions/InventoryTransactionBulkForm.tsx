import { useState } from "react";

import { useNavigate } from "react-router-dom";

// types
import { IInventoryTransactionLessRelatedBulk, TransactionType } from "./types";
import { IAssetFullCategory } from "../assets/types";

// components
import InventoryTransactionAddBulkForm from "./InventoryTransactionAddBulk";

// custom hooks
import { useAssets } from "../../hooks/useAssets";
import { useInventories } from "../../hooks/useInventories";
import { useNewManyInventoryTransaction } from "../../hooks/useNewManyInventoryTransaction";
import { useMessage } from "../../hooks/useMessage";

// messages
import { Error, useError } from "../../hooks/useError";
import { RECORD_CREATED } from "../../utils/constants";
import { AlertColorScheme, AlertStatus } from "../../utils/enums";
import { useAdjustManyInventory } from "../../hooks/useAdjustManyInventory";

const InventoryTransactionBulkForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { throwError } = useError();

  const { showMessage } = useMessage();

  const queryInventories = useInventories({});
  const inventoriesByAsset = queryInventories.inventoriesByAssetId;

  const queryAssets = useAssets({});
  const assets = queryAssets?.data as IAssetFullCategory[];
  const { adjustManyInventory } = useAdjustManyInventory();

  const { addNewManyInventoryTransaction } = useNewManyInventoryTransaction();

  const navigate = useNavigate();

  const onSubmit = async (
    inventoryTransactions: IInventoryTransactionLessRelatedBulk,
  ) => {
    setIsLoading(true);
    try {
      // Todo: actualizar el inventario de cada insumo.

      let adjustments: Array<{
        id?: string;
        asset?: string;
        quantityDelta: number;
      }> = [];

      inventoryTransactions.inventoryTransactions.forEach(
        (inventoryTransaction) => {
          const inv = inventoriesByAsset?.get(
            String(inventoryTransaction.asset),
          );
          if (!inv) return;

          inventoryTransaction.oldQuantityAvailable = inv.quantityAvailable;

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
            (inv.quantityAvailable ?? 0) + quantityDelta;
          inventoryTransaction.unitCost = inv.asset?.costPrice;

          adjustments.push({
            id: inv._id,
            asset: inv.asset?._id,
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
        // Todo: registrar las transacciones del inventario de cada insumo.

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
      assets={assets}
    />
  );
};

export default InventoryTransactionBulkForm;
