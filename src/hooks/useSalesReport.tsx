// libs
import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"

// types
import { ISaleFullRelated } from "../components/sales/types"
import { IFilters } from "../components/common/types"

// services
import reportsService from "../services/reports"

// hooks
import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  id?: string
  historyMonthToRetrieve?: number
}

export const useSalesReport = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id, historyMonthToRetrieve } = props

  const query: UseQueryResult<ISaleFullRelated[], Error> = useQuery({
    queryKey: [
      "reportSales",
      {
        filters: { id, historyMonthToRetrieve },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as IFilters
      const { data } = await reportsService.getAllSales(
        { ...filters },
        axiosPrivate
      )
      return data
    },
    staleTime: Infinity,
  })

  return query
}
