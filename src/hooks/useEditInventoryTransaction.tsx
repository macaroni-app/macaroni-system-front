import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IInventoryTransactionLessRelated } from "../components/inventoryTransactions/types"

import inventoryTransactionService from "../services/inventoryTransaction"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  inventoryTransactionId: string
  inventoryTransactionToUpdate: IInventoryTransactionLessRelated
}

export const useEditInventoryTransaction = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editInventoryTransaction } = useMutation({
    mutationFn: ({
      inventoryTransactionId,
      inventoryTransactionToUpdate,
    }: Props) =>
      inventoryTransactionService.update(
        inventoryTransactionId,
        inventoryTransactionToUpdate,
        axiosPrivate
      ),
    onMutate: async (inventoryTransactionToUpdate) => {
      queryClient.cancelQueries({ queryKey: ["inventoryTransactions"] })

      const previousInventoryTransactions =
        queryClient.getQueryData<IInventoryTransactionLessRelated>([
          "inventoryTransactions",
        ])

      queryClient.setQueryData(
        ["inventoryTransactions"],
        (oldData: IInventoryTransactionLessRelated[]) => {
          if (oldData == null) return [inventoryTransactionToUpdate]
          return [inventoryTransactionToUpdate, ...oldData]
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

  return { editInventoryTransaction }
}
