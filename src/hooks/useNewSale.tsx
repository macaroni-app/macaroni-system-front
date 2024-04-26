import { useMutation, useQueryClient } from "@tanstack/react-query"

import saleService from "../services/sale"

import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { ISaleLessRelated } from "../components/sales/types"

export const useNewSale = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewSale } = useMutation({
    mutationFn: (newSale: ISaleLessRelated) =>
      saleService.store(newSale, axiosPrivate),
    onMutate: async (newSale) => {
      queryClient.cancelQueries({ queryKey: ["sales"] })

      const previousSales = queryClient.getQueryData<ISaleLessRelated>([
        "sales",
      ])

      queryClient.setQueryData(["sales"], (oldData: ISaleLessRelated[]) => {
        if (oldData == null) return [newSale]
        return [newSale, ...oldData]
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

  return { addNewSale }
}
