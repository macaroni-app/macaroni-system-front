import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IPaymentMethod } from "../components/paymentMethods/types"

import methodPaymentService from "../services/methodPayment"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deletePaymentMethod } = useMutation({
    mutationFn: (paymentMethodId: string) => {
      return methodPaymentService.delete(paymentMethodId, axiosPrivate)
    },
    onMutate: async (paymentMethodId) => {
      queryClient.cancelQueries({ queryKey: ["paymentMethods"] })

      const previousPaymentMethods = queryClient.getQueryData<IPaymentMethod>([
        "paymentMethods",
      ])

      queryClient.setQueryData(
        ["paymentMethods"],
        (oldData: IPaymentMethod[]) => {
          if (oldData == null) return []
          return [...oldData.filter((c) => c._id !== paymentMethodId)]
        }
      )

      return { previousPaymentMethods }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousPaymentMethods != null) {
        queryClient.setQueryData(
          ["paymentMethods"],
          context.previousPaymentMethods
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] })
    },
  })

  return { deletePaymentMethod }
}
