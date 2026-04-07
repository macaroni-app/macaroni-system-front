import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IOrderRequestLessRelated } from "../components/orderRequests/types"
import orderRequestService from "../services/orderRequest"
import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  orderRequestId: string
  orderRequestToUpdate: IOrderRequestLessRelated
}

export const useEditOrderRequest = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editOrderRequest } = useMutation({
    mutationFn: ({ orderRequestId, orderRequestToUpdate }: Props) =>
      orderRequestService.update(orderRequestId, orderRequestToUpdate, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orderRequests"] })
      queryClient.invalidateQueries({ queryKey: ["orderRequest"] })
    },
  })

  return { editOrderRequest }
}
