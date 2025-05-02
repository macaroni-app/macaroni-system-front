import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IBusiness } from "../components/businesses/types"

import businessService from "../services/business"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useNewBusiness = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewBusiness } = useMutation({
    mutationFn: (newBusiness: IBusiness) =>
      businessService.store(newBusiness, axiosPrivate),
    onMutate: async (newBusiness) => {
      queryClient.cancelQueries({ queryKey: ["businesses"] })

      const previousBusinesses = queryClient.getQueryData<IBusiness>(["businesses"])

      queryClient.setQueryData(["businesses"], (oldData: IBusiness[]) => {
        if (oldData == null) return [newBusiness]
        return [newBusiness, ...oldData]
      })

      return { previousBusinesses }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousBusinesses != null) {
        queryClient.setQueryData(["businesses"], context.previousBusinesses)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] })
    },
  })

  return { addNewBusiness }
}
