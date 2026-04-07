import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IOrderRequestItemLessRelated } from "../components/orderRequests/types"
import orderRequestItemService from "../services/orderRequestItem"
import useAxiosPrivate from "./useAxiosPrivate"

export const useNewManyOrderRequestItem = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewManyOrderRequestItem } = useMutation({
    mutationFn: (newOrderRequestItems: IOrderRequestItemLessRelated[]) =>
      orderRequestItemService.storeMany(newOrderRequestItems, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orderRequestItems"] })
      queryClient.invalidateQueries({ queryKey: ["orderRequests"] })
      queryClient.invalidateQueries({ queryKey: ["orderRequest"] })
    },
  })

  return { addNewManyOrderRequestItem }
}
