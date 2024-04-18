import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IInventoryLessRelated } from "../components/inventories/types"

import inventoryService from "../services/inventory"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  inventoryId: string
  inventoryToUpdate: IInventoryLessRelated
}

export const useEditInventory = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editInventory } = useMutation({
    mutationFn: ({ inventoryId, inventoryToUpdate }: Props) =>
      inventoryService.update(inventoryId, inventoryToUpdate, axiosPrivate),
    onMutate: async (inventoryToUpdate) => {
      queryClient.cancelQueries({ queryKey: ["inventories"] })

      const previousInventories =
        queryClient.getQueryData<IInventoryLessRelated>(["inventories"])

      queryClient.setQueryData(
        ["inventories"],
        (oldData: IInventoryLessRelated[]) => {
          if (oldData == null) return [inventoryToUpdate]
          return [inventoryToUpdate, ...oldData]
        }
      )

      return { previousInventories }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousInventories != null) {
        queryClient.setQueryData(["inventories"], context.previousInventories)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] })
    },
  })

  return { editInventory }
}
