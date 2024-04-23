import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IInventoryTransactionLessRelated } from "../components/inventoryTransactions/types"

import inventoryTransactionService from "../services/inventoryTransaction"

import useAxiosPrivate from "./useAxiosPrivate"

export const useNewManyInventoryTransaction = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewManyInventoryTransaction } = useMutation({
    mutationFn: (
      newInventoryTransactions: IInventoryTransactionLessRelated[]
    ) =>
      inventoryTransactionService.storeMany(
        newInventoryTransactions,
        axiosPrivate
      ),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryTransactions"] })
    },
  })

  return { addNewManyInventoryTransaction }
}
