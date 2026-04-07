import { useMutation, useQueryClient } from "@tanstack/react-query"
import orderRequestService from "../services/orderRequest"
import useAxiosPrivate from "./useAxiosPrivate"

export const useConfirmOrderRequest = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: confirmOrderRequest } = useMutation({
    mutationFn: (orderRequestId: string) =>
      orderRequestService.confirm(orderRequestId, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orderRequests"] })
      queryClient.invalidateQueries({ queryKey: ["orderRequest"] })
      queryClient.invalidateQueries({ queryKey: ["inventories"] })
    },
  })

  return { confirmOrderRequest }
}
