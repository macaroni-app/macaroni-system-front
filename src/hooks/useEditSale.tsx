import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ISaleLessRelated } from "../components/sales/types"

import saleService from "../services/sale"

import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  saleId: string
  saleToUpdate: ISaleLessRelated
}

export const useEditSale = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editSale } = useMutation({
    mutationFn: ({ saleId, saleToUpdate }: Props) =>
      saleService.update(saleId, saleToUpdate, axiosPrivate),
    onMutate: async (saleToUpdate) => {
      queryClient.cancelQueries({ queryKey: ["sales"] })

      const previousSales = queryClient.getQueryData<ISaleLessRelated>([
        "sales",
      ])

      queryClient.setQueryData(["sales"], (oldData: ISaleLessRelated[]) => {
        if (oldData == null) return [saleToUpdate]
        return [saleToUpdate, ...oldData]
      })

      return { previousSales }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousSales != null) {
        queryClient.setQueryData(["sales"], context.previousSales)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] })
    },
  })

  return { editSale }
}
