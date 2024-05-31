import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IFixedCost } from "../components/fixedCosts/types"

import fixedCostService from "../services/fixedCost"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useDeleteFixedCost = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteFixedCost } = useMutation({
    mutationFn: (fixedCostId: string) => {
      return fixedCostService.delete(fixedCostId, axiosPrivate)
    },
    onMutate: async (fixedCostId) => {
      queryClient.cancelQueries({ queryKey: ["fixedCosts"] })

      const previousFixedCosts = queryClient.getQueryData<IFixedCost>([
        "fixedCosts",
      ])

      queryClient.setQueryData(["fixedCosts"], (oldData: IFixedCost[]) => {
        if (oldData == null) return []
        return [...oldData.filter((f) => f._id !== fixedCostId)]
      })

      return { previousFixedCosts }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousFixedCosts != null) {
        queryClient.setQueryData(["fixedCosts"], context.previousFixedCosts)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["fixedCosts"] })
    },
  })

  return { deleteFixedCost }
}
