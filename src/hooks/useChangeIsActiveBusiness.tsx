import { useMutation, useQueryClient } from "@tanstack/react-query"

import businessService from "../services/business"

import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  businessId: string
  isActive: boolean
}

export const useChangeIsActiveBusiness = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: changeIsActiveBusiness } = useMutation({
    mutationFn: ({ businessId, isActive }: Props) => {
      return businessService.changeIsActive(businessId, isActive, axiosPrivate)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] })
    },
  })

  return { changeIsActiveBusiness }
}
