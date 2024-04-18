import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IInventoryLessRelated } from "../components/inventories/types"

import inventoryService from "../services/inventory"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useNewInventory = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewInventory } = useMutation({
    mutationFn: (newInventory: IInventoryLessRelated) =>
      inventoryService.store(newInventory, axiosPrivate),
    onMutate: async (newInventory) => {
      queryClient.cancelQueries({ queryKey: ["inventories"] })

      const previousInventories =
        queryClient.getQueryData<IInventoryLessRelated>(["inventories"])

      queryClient.setQueryData(
        ["inventories"],
        (oldData: IInventoryLessRelated[]) => {
          if (oldData == null) return [newInventory]
          return [newInventory, ...oldData]
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

  return { addNewInventory }
}
