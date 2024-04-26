import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ISaleItemLessRelated } from "../components/sales/types"

import saleItemService from "../services/saleItem"

import useAxiosPrivate from "./useAxiosPrivate"

export const useNewManySaleItem = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewManySaleItem } = useMutation({
    mutationFn: (newSaleItems: ISaleItemLessRelated[]) =>
      saleItemService.storeMany(newSaleItems, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["saleItems"] })
    },
  })

  return { addNewManySaleItem }
}
