import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"
import { IFilters } from "../components/common/types"
import { IOrderRequestFullRelated } from "../components/orderRequests/types"
import orderRequestService from "../services/orderRequest"
import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  id?: string
  orderCode?: string
  clientName?: string
  startDate?: string
  endDate?: string
}

export const useOrderRequests = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id, orderCode, clientName, startDate, endDate } = props || ""

  const query: UseQueryResult<IOrderRequestFullRelated[], Error> = useQuery({
    queryKey: [
        "orderRequests",
        {
        filters: { startDate, endDate, id, orderCode, clientName },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as IFilters & {
        filters: { id?: string, orderCode?: string, clientName?: string, startDate?: string, endDate?: string }
      }
      const { data } = await orderRequestService.getAll({ ...filters }, axiosPrivate)
      return data
    },
    staleTime: Infinity,
  })

  return query
}
