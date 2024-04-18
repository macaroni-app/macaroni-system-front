import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IInventoryTransactionFullRelated } from "../components/inventoryTransactions/types"

import inventoryTransactionService from "../services/inventoryTransaction"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useDeleteInventoryTransaction = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteInventoryTransaction } = useMutation({
    mutationFn: (inventoryTransactionId: string) => {
      return inventoryTransactionService.delete(
        inventoryTransactionId,
        axiosPrivate
      )
    },
    onMutate: async (inventoryTransactionId) => {
      queryClient.cancelQueries({ queryKey: ["inventoryTransactions"] })

      const previousInventoryTransactions =
        queryClient.getQueryData<IInventoryTransactionFullRelated>([
          "inventoryTransactions",
        ])

      queryClient.setQueryData(
        ["inventoryTransactions"],
        (oldData: IInventoryTransactionFullRelated[]) => {
          if (oldData == null) return []
          return [...oldData.filter((c) => c._id !== inventoryTransactionId)]
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

  return { deleteInventoryTransaction }
}
