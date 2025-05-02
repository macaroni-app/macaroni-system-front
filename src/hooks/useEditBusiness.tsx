import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IBusiness } from "../components/businesses/types"

import businessService from "../services/business"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  businessId: string
  businessToUpdate: IBusiness
}

export const useEditBusiness = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editBusiness } = useMutation({
    mutationFn: ({ businessId, businessToUpdate }: Props) =>
      businessService.update(businessId, businessToUpdate, axiosPrivate),
    onMutate: async (businessToUpdate) => {
      queryClient.cancelQueries({ queryKey: ["businesses"] })

      const previousBusinesses = queryClient.getQueryData<IBusiness>(["businesses"])

      queryClient.setQueryData(["businesses"], (oldData: IBusiness[]) => {
        if (oldData == null) return [businessToUpdate]
        return [businessToUpdate, ...oldData]
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

  return { editBusiness }
}
