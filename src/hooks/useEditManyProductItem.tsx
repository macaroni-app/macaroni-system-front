import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IProductItem } from "../components/products/types"

import productItemService from "../services/productItem"

import useAxiosPrivate from "./useAxiosPrivate"

export const useEditManyProductItem = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editManyProductItem } = useMutation({
    mutationFn: (productItemsToUpdate: IProductItem[]) =>
      productItemService.updateMany(productItemsToUpdate, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["productItems"] })
    },
  })

  return { editManyProductItem }
}
