import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IProductComplete } from "../components/products/types"

import productService from "../services/product"

import useAxiosPrivate from "./useAxiosPrivate"

export const useNewProduct = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewProduct } = useMutation({
    mutationFn: (newProduct: IProductComplete) =>
      productService.store(newProduct, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  return { addNewProduct }
}
