import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IProductItem } from "../components/products/types"

import productItemService from "../services/productItem"

import useAxiosPrivate from "./useAxiosPrivate"

export const useDeleteManyProductItem = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteManyProductItem } = useMutation({
    mutationFn: (productItemsToDelete: IProductItem[]) =>
      productItemService.deleteMany(productItemsToDelete, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["productItems"] })
    },
  })

  return { deleteManyProductItem }
}
