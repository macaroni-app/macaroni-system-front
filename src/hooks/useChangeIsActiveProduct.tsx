import { useMutation, useQueryClient } from "@tanstack/react-query"

import productService from "../services/product"

import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  productId: string
  isActive: boolean
}

export const useChangeIsActiveProduct = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: changeIsActiveProduct } = useMutation({
    mutationFn: ({ productId, isActive }: Props) => {
      return productService.changeIsActive(productId, isActive, axiosPrivate)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  return { changeIsActiveProduct }
}
