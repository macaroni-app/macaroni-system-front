import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IFixedCost } from "../components/fixedCosts/types"

import fixedCostService from "../services/fixedCost"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  fixedCostId: string
  fixedCostToUpdate: IFixedCost
}

export const useEditFixedCost = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editFixedCost } = useMutation({
    mutationFn: ({ fixedCostId, fixedCostToUpdate }: Props) =>
      fixedCostService.update(fixedCostId, fixedCostToUpdate, axiosPrivate),
    onMutate: async (fixedCostToUpdate) => {
      queryClient.cancelQueries({ queryKey: ["fixedCosts"] })

      const previousFixedCosts = queryClient.getQueryData<IFixedCost>([
        "fixedCosts",
      ])

      queryClient.setQueryData(["fixedCosts"], (oldData: IFixedCost[]) => {
        if (oldData == null) return [fixedCostToUpdate]
        return [fixedCostToUpdate, ...oldData]
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

  return { editFixedCost }
}
