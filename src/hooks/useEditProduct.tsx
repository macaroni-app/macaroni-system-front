import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IProduct } from "../components/products/types"

import productService from "../services/product"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  productId: string
  productToUpdate: IProduct
}

export const useEditProduct = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editProduct } = useMutation({
    mutationFn: ({ productId, productToUpdate }: Props) =>
      productService.update(productId, productToUpdate, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  return { editProduct }
}
