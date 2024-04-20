import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ISaleItemLessRelated } from "../components/sales/types"

import saleItemService from "../services/saleItem"

import useAxiosPrivate from "./useAxiosPrivate"

export const useDeleteManySaleItem = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteManySaleItem } = useMutation({
    mutationFn: (saleItemsToDelete: ISaleItemLessRelated[]) =>
      saleItemService.deleteMany(saleItemsToDelete, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["saleItems"] })
    },
  })

  return { deleteManySaleItem }
}
