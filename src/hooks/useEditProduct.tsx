import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IProductComplete } from "../components/products/types"

import productService from "../services/product"

import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  productId: string
  productToUpdate: IProductComplete
}

export const useEditProduct = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editProduct } = useMutation({
    mutationFn: ({ productId, productToUpdate }: Props) =>
      productService.update(productId, productToUpdate, axiosPrivate),
    onMutate: async (productToUpdate) => {
      queryClient.cancelQueries({ queryKey: ["products"] })

      const previousProducts = queryClient.getQueryData<IProductComplete>([
        "products",
      ])

      queryClient.setQueryData(["products"], (oldData: IProductComplete[]) => {
        if (oldData == null) return [productToUpdate]
        return [productToUpdate, ...oldData]
      })

      return { previousProducts }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousProducts != null) {
        queryClient.setQueryData(["products"], context.previousProducts)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  return { editProduct }
}
