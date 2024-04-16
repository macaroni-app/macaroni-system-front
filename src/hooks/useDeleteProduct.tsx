import { useMutation, useQueryClient } from "@tanstack/react-query"

import productService from "../services/product"

import useAxiosPrivate from "./useAxiosPrivate"

import { IProductLessRelated } from "../components/products/types"

interface Props {
  productId?: string
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteProduct } = useMutation({
    mutationFn: ({ productId }: Props) => {
      return productService.delete(productId, axiosPrivate)
    },
    onMutate: async (productToDelete) => {
      queryClient.cancelQueries({ queryKey: ["products"] })

      const previousProducts = queryClient.getQueryData<IProductLessRelated>([
        "products",
      ])

      queryClient.setQueryData(
        ["products"],
        (oldData: IProductLessRelated[]) => {
          if (oldData == null) return []
          return [...oldData.filter((c) => c._id !== productToDelete)]
        }
      )

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

  return { deleteProduct }
}
