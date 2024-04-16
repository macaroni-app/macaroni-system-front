import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IProductLessRelated } from "../components/products/types"

import productService from "../services/product"

import useAxiosPrivate from "./useAxiosPrivate"

export const useNewProduct = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewProduct } = useMutation({
    mutationFn: (newProduct: IProductLessRelated) =>
      productService.store(newProduct, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  return { addNewProduct }
}
