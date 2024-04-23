import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IInventoryLessRelated } from "../components/inventories/types"

import inventoryService from "../services/inventory"

import useAxiosPrivate from "./useAxiosPrivate"

export const useEditManyInventory = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editManyInventory } = useMutation({
    mutationFn: (inventoriesToUpdate: IInventoryLessRelated[]) =>
      inventoryService.updateMany(inventoriesToUpdate, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] })
    },
  })

  return { editManyInventory }
}
