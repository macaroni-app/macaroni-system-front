import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IProduct } from "../components/products/types"

import productService from "../services/product"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useNewProduct = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewProduct } = useMutation({
    mutationFn: (newProduct: IProduct) =>
      productService.store(newProduct, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  return { addNewProduct }
}
