import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IFixedCost } from "../components/fixedCosts/types"

import fixedCostService from "../services/fixedCost"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useNewFixedCost = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewFixedCost } = useMutation({
    mutationFn: (newFixedCost: IFixedCost) =>
      fixedCostService.store(newFixedCost, axiosPrivate),
    onMutate: async (newFixedCost) => {
      queryClient.cancelQueries({ queryKey: ["fixedCosts"] })

      const previousFixedCosts = queryClient.getQueryData<IFixedCost>([
        "fixedCosts",
      ])

      queryClient.setQueryData(["fixedCosts"], (oldData: IFixedCost[]) => {
        if (oldData == null) return [newFixedCost]
        return [newFixedCost, ...oldData]
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

  return { addNewFixedCost }
}
