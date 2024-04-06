import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IProductTypeType } from "../components/productTypes/types"

import productTypeService from "../services/productType"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useNewProductType = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewProductType } = useMutation({
    mutationFn: (newProductType: IProductTypeType) =>
      productTypeService.store(newProductType, axiosPrivate),
    onMutate: async (newProductType) => {
      queryClient.cancelQueries({ queryKey: ["productTypes"] })

      const previousProductTypes = queryClient.getQueryData<IProductTypeType>([
        "productTypes",
      ])

      queryClient.setQueryData(
        ["productTypes"],
        (oldData: IProductTypeType[]) => {
          if (oldData == null) return [newProductType]
          return [newProductType, ...oldData]
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

  return { addNewProductType }
}
