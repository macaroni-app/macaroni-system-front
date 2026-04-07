import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IAddOrderRequestPaymentPayload } from "../components/orderRequests/types"
import orderRequestService from "../services/orderRequest"
import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  orderRequestId: string
  payload: IAddOrderRequestPaymentPayload
}

export const useAddOrderRequestPayment = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addOrderRequestPayment } = useMutation({
    mutationFn: ({ orderRequestId, payload }: Props) =>
      orderRequestService.addPayment(orderRequestId, payload, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orderRequests"] })
      queryClient.invalidateQueries({ queryKey: ["orderRequest"] })
    },
  })

  return { addOrderRequestPayment }
}
