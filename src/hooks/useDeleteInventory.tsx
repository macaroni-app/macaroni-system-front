import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IInventoryFullRelated } from "../components/inventories/types"

import inventoryService from "../services/inventory"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useDeleteInventory = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteInventory } = useMutation({
    mutationFn: (inventoryId: string) => {
      return inventoryService.delete(inventoryId, axiosPrivate)
    },
    onMutate: async (inventoryId) => {
      queryClient.cancelQueries({ queryKey: ["inventories"] })

      const previousInventories =
        queryClient.getQueryData<IInventoryFullRelated>(["inventories"])

      queryClient.setQueryData(
        ["inventories"],
        (oldData: IInventoryFullRelated[]) => {
          if (oldData == null) return []
          return [...oldData.filter((c) => c._id !== inventoryId)]
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

  return { deleteInventory }
}
