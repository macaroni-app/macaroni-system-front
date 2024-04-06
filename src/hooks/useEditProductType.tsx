import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IProductTypeType } from "../components/productTypes/types"

import productTypeService from "../services/productType"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  productTypeId: string
  productTypeToUpdate: IProductTypeType
}

export const useEditProductType = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editProductType } = useMutation({
    mutationFn: ({ productTypeId, productTypeToUpdate }: Props) =>
      productTypeService.update(
        productTypeId,
        productTypeToUpdate,
        axiosPrivate
      ),
    onMutate: async (productTypeToUpdate) => {
      queryClient.cancelQueries({ queryKey: ["productTypes"] })

      const previousProductTypes = queryClient.getQueryData<IProductTypeType>([
        "productTypes",
      ])

      queryClient.setQueryData(
        ["productTypes"],
        (oldData: IProductTypeType[]) => {
          if (oldData == null) return [productTypeToUpdate]
          return [productTypeToUpdate, ...oldData]
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

  return { editProductType }
}
