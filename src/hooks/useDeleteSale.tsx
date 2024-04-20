import { useMutation, useQueryClient } from "@tanstack/react-query"

import saleService from "../services/sale"

import useAxiosPrivate from "./useAxiosPrivate"

import { ISaleLessRelated } from "../components/sales/types"

interface Props {
  saleId?: string
}

export const useDeleteSale = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteSale } = useMutation({
    mutationFn: ({ saleId }: Props) => {
      return saleService.delete(saleId, axiosPrivate)
    },
    onMutate: async (saleToDelete) => {
      queryClient.cancelQueries({ queryKey: ["sales"] })

      const previousSales = queryClient.getQueryData<ISaleLessRelated>([
        "sales",
      ])

      queryClient.setQueryData(["sales"], (oldData: ISaleLessRelated[]) => {
        if (oldData == null) return []
        return [...oldData.filter((c) => c._id !== saleToDelete)]
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

  return { deleteSale }
}
