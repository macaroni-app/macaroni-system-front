// libs
import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"

// types
import { ISaleItemFullRelated } from "../components/sales/types"
import { IFilters } from "../components/common/types"

// services
import saleItemService from "../services/saleItem"

// hooks
import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  id?: string
  startDate?: string
  endDate?: string
}

export const useSaleItems = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id, startDate, endDate } = props || ""

  const query: UseQueryResult<ISaleItemFullRelated[], Error> = useQuery({
    queryKey: [
      "saleItems",
      {
        filters: { startDate, endDate, id },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as IFilters
      const { data } = await saleItemService.getAll(
        { ...filters },
        axiosPrivate
      )
      return data
    },
    staleTime: Infinity,
  })

  return query
}
