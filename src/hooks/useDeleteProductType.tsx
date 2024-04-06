import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IProductTypeType } from "../components/productTypes/types"

import productTypeService from "../services/productType"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useDeleteProductType = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteProductType } = useMutation({
    mutationFn: (productTypeId: string) => {
      return productTypeService.delete(productTypeId, axiosPrivate)
    },
    onMutate: async (productTypeId) => {
      queryClient.cancelQueries({ queryKey: ["productTypes"] })

      const previousProductTypes = queryClient.getQueryData<IProductTypeType>([
        "productTypes",
      ])

      queryClient.setQueryData(
        ["productTypes"],
        (oldData: IProductTypeType[]) => {
          if (oldData == null) return []
          return [...oldData.filter((c) => c._id !== productTypeId)]
        }
      )

      return { previousProductTypes }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousProductTypes != null) {
        queryClient.setQueryData(["productTypes"], context.previousProductTypes)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["productTypes"] })
    },
  })

  return { deleteProductType }
}
