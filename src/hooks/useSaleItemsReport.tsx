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
  historyMonthToRetrieve?: number
}

export const useSaleItemsReport = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id, historyMonthToRetrieve } = props

  const query: UseQueryResult<ISaleItemFullRelated[], Error> = useQuery({
    queryKey: [
      "reportSaleItems",
      {
        filters: { id, historyMonthToRetrieve },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as IFilters
      const { data } = await saleItemService.getAllForReport(
        { ...filters },
        axiosPrivate
      )
      return data
    },
    staleTime: Infinity,
  })

  return query
}
