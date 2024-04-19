import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IPaymentMethod } from "../components/paymentMethods/types"

import methodPaymentService from "../services/methodPayment"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  paymentMethodId: string
  paymentMethodToUpdate: IPaymentMethod
}

export const useEditPaymentMethod = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editPaymentMethod } = useMutation({
    mutationFn: ({ paymentMethodId, paymentMethodToUpdate }: Props) =>
      methodPaymentService.update(
        paymentMethodId,
        paymentMethodToUpdate,
        axiosPrivate
      ),
    onMutate: async (paymentMethodToUpdate) => {
      queryClient.cancelQueries({ queryKey: ["paymentMethods"] })

      const previousPaymentMethods = queryClient.getQueryData<IPaymentMethod>([
        "paymentMethods",
      ])

      queryClient.setQueryData(
        ["paymentMethods"],
        (oldData: IPaymentMethod[]) => {
          if (oldData == null) return [paymentMethodToUpdate]
          return [paymentMethodToUpdate, ...oldData]
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

  return { editPaymentMethod }
}
