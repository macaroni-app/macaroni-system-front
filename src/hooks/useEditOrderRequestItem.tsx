import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IOrderRequestItemLessRelated } from "../components/orderRequests/types"
import orderRequestItemService from "../services/orderRequestItem"
import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  orderRequestItemId: string
  orderRequestItemToUpdate: IOrderRequestItemLessRelated
}

export const useEditOrderRequestItem = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editOrderRequestItem } = useMutation({
    mutationFn: ({ orderRequestItemId, orderRequestItemToUpdate }: Props) =>
      orderRequestItemService.update(orderRequestItemId, orderRequestItemToUpdate, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orderRequestItems"] })
      queryClient.invalidateQueries({ queryKey: ["orderRequests"] })
      queryClient.invalidateQueries({ queryKey: ["orderRequest"] })
    },
  })

  return { editOrderRequestItem }
}
