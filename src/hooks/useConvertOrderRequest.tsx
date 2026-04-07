import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IConvertOrderRequestPayload } from "../components/orderRequests/types"
import orderRequestService from "../services/orderRequest"
import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  orderRequestId: string
  payload: IConvertOrderRequestPayload
}

export const useConvertOrderRequest = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: convertOrderRequest } = useMutation({
    mutationFn: ({ orderRequestId, payload }: Props) =>
      orderRequestService.convertToSale(orderRequestId, payload, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orderRequests"] })
      queryClient.invalidateQueries({ queryKey: ["orderRequest"] })
      queryClient.invalidateQueries({ queryKey: ["sales"] })
      queryClient.invalidateQueries({ queryKey: ["saleItems"] })
      queryClient.invalidateQueries({ queryKey: ["inventories"] })
      queryClient.invalidateQueries({ queryKey: ["inventoryTransactions"] })
    },
  })

  return { convertOrderRequest }
}
