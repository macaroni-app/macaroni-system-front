import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IBusiness } from "../components/businesses/types"

import businessService from "../services/business"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useDeleteBusiness = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteBusiness } = useMutation({
    mutationFn: (businessId: string) => {
      return businessService.delete(businessId, axiosPrivate)
    },
    onMutate: async (businessId) => {
      queryClient.cancelQueries({ queryKey: ["businesses"] })

      const previousBusinesses = queryClient.getQueryData<IBusiness>(["businesses"])

      queryClient.setQueryData(["businesses"], (oldData: IBusiness[]) => {
        if (oldData == null) return []
        return [...oldData.filter((c) => c._id !== businessId)]
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

  return { deleteBusiness }
}
