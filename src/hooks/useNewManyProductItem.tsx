import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IProductItemLessRelated } from "../components/products/types"

import productItemService from "../services/productItem"

import useAxiosPrivate from "./useAxiosPrivate"

export const useNewManyProductItem = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewManyProductItem } = useMutation({
    mutationFn: (newProductItems: IProductItemLessRelated[]) =>
      productItemService.storeMany(newProductItems, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["productItems"] })
    },
  })

  return { addNewManyProductItem }
}
