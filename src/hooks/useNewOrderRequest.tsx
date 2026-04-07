import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IOrderRequestLessRelated } from "../components/orderRequests/types"
import orderRequestService from "../services/orderRequest"
import useAxiosPrivate from "./useAxiosPrivate"

export const useNewOrderRequest = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewOrderRequest } = useMutation({
    mutationFn: (newOrderRequest: IOrderRequestLessRelated) =>
      orderRequestService.store(newOrderRequest, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orderRequests"] })
    },
  })

  return { addNewOrderRequest }
}
