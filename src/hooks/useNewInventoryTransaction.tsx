import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IInventoryTransactionLessRelated } from "../components/inventoryTransactions/types"

import inventoryTransactionService from "../services/inventoryTransaction"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useNewInventoryTransaction = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewInventoryTransaction } = useMutation({
    mutationFn: (newInventoryTransaction: IInventoryTransactionLessRelated) =>
      inventoryTransactionService.store(newInventoryTransaction, axiosPrivate),
    onMutate: async (newInventoryTransaction) => {
      queryClient.cancelQueries({ queryKey: ["inventoryTransactions"] })

      const previousInventoryTransactions =
        queryClient.getQueryData<IInventoryTransactionLessRelated>([
          "inventoryTransactions",
        ])

      queryClient.setQueryData(
        ["inventoryTransactions"],
        (oldData: IInventoryTransactionLessRelated[]) => {
          if (oldData == null) return [newInventoryTransaction]
          return [newInventoryTransaction, ...oldData]
        }
      )

      return { previousInventoryTransactions }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousInventoryTransactions != null) {
        queryClient.setQueryData(
          ["inventoryTransactions"],
          context.previousInventoryTransactions
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryTransactions"] })
    },
  })

  return { addNewInventoryTransaction }
}
