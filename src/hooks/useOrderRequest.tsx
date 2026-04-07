import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { IOrderRequestFullRelated } from "../components/orderRequests/types"
import orderRequestService from "../services/orderRequest"
import useAxiosPrivate from "./useAxiosPrivate"

export const useOrderRequest = (id?: string) => {
  const axiosPrivate = useAxiosPrivate()

  const query: UseQueryResult<IOrderRequestFullRelated, Error> = useQuery({
    queryKey: ["orderRequest", id],
    queryFn: async () => {
      const { data } = await orderRequestService.getOne(id ?? "", axiosPrivate)
      return data
    },
    enabled: id !== undefined && id !== "",
    staleTime: Infinity,
  })

  return query
}
