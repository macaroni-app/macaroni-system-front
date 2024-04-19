import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IPaymentMethod } from "../components/paymentMethods/types"

import methodPaymentService from "../services/methodPayment"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useNewPaymentMethod = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewPaymentMethod } = useMutation({
    mutationFn: (newPaymentMethod: IPaymentMethod) =>
      methodPaymentService.store(newPaymentMethod, axiosPrivate),
    onMutate: async (newPaymentMethod) => {
      queryClient.cancelQueries({ queryKey: ["paymentMethods"] })

      const previousMethodPayments = queryClient.getQueryData<IPaymentMethod>([
        "paymentMethods",
      ])

      queryClient.setQueryData(
        ["paymentMethods"],
        (oldData: IPaymentMethod[]) => {
          if (oldData == null) return [newPaymentMethod]
          return [newPaymentMethod, ...oldData]
        }
      )

      return { previousMethodPayments }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousMethodPayments != null) {
        queryClient.setQueryData(
          ["paymentMethods"],
          context.previousMethodPayments
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] })
    },
  })

  return { addNewPaymentMethod }
}
