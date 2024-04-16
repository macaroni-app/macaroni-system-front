import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IProductItemLessRelated } from "../components/products/types"

import productItemService from "../services/productItem"

import useAxiosPrivate from "./useAxiosPrivate"

export const useDeleteManyProductItem = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteManyProductItem } = useMutation({
    mutationFn: (productItemsToDelete: IProductItemLessRelated[]) =>
      productItemService.deleteMany(productItemsToDelete, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["productItems"] })
    },
  })

  return { deleteManyProductItem }
}
