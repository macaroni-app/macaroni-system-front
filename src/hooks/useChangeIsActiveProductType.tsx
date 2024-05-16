import { useMutation, useQueryClient } from "@tanstack/react-query"

import productTypeService from "../services/productType"

import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  productTypeId: string
  isActive: boolean
}

export const useChangeIsActiveProductType = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: changeIsActiveProductType } = useMutation({
    mutationFn: ({ productTypeId, isActive }: Props) => {
      return productTypeService.changeIsActive(
        productTypeId,
        isActive,
        axiosPrivate
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["productTypes"] })
    },
  })

  return { changeIsActiveProductType }
}
