import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IOrderRequestItemLessRelated } from "../components/orderRequests/types"
import orderRequestItemService from "../services/orderRequestItem"
import useAxiosPrivate from "./useAxiosPrivate"

export const useDeleteManyOrderRequestItem = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteManyOrderRequestItem } = useMutation({
    mutationFn: (orderRequestItemsToDelete: IOrderRequestItemLessRelated[]) =>
      orderRequestItemService.deleteMany(orderRequestItemsToDelete, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orderRequestItems"] })
      queryClient.invalidateQueries({ queryKey: ["orderRequests"] })
      queryClient.invalidateQueries({ queryKey: ["orderRequest"] })
    },
  })

  return { deleteManyOrderRequestItem }
}
