import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"
import { IOrderRequestItemFullRelated } from "../components/orderRequests/types"
import orderRequestItemService from "../services/orderRequestItem"
import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  id?: string
  all?: boolean
}

export const useOrderRequestItems = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id, all } = props || ""

  const query: UseQueryResult<IOrderRequestItemFullRelated[], Error> = useQuery({
    queryKey: [
      "orderRequestItems",
      {
        filters: { id, all },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as { filters: { id?: string, all?: boolean } }
      const { data } = await orderRequestItemService.getAll({ ...filters }, axiosPrivate)
      return data
    },
    staleTime: Infinity,
  })

  return query
}
