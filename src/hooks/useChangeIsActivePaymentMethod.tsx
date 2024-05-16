import { useMutation, useQueryClient } from "@tanstack/react-query"

import paymentMethodService from "../services/methodPayment"

import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  methodPaymentId: string
  isActive: boolean
}

export const useChangeIsActivePaymentMethod = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: changeIsActivePaymentMethod } = useMutation({
    mutationFn: ({ methodPaymentId, isActive }: Props) => {
      return paymentMethodService.changeIsActive(
        methodPaymentId,
        isActive,
        axiosPrivate
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] })
    },
  })

  return { changeIsActivePaymentMethod }
}
