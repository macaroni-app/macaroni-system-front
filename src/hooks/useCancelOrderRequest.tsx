import { useMutation, useQueryClient } from "@tanstack/react-query"
import orderRequestService from "../services/orderRequest"
import useAxiosPrivate from "./useAxiosPrivate"

export const useCancelOrderRequest = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: cancelOrderRequest } = useMutation({
    mutationFn: (orderRequestId: string) =>
      orderRequestService.cancel(orderRequestId, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orderRequests"] })
      queryClient.invalidateQueries({ queryKey: ["orderRequest"] })
      queryClient.invalidateQueries({ queryKey: ["inventories"] })
    },
  })

  return { cancelOrderRequest }
}
