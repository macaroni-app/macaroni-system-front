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
import saleService from "../services/sale"

// hooks
import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  id?: string
  startDate?: string
  endDate?: string
}

export const useSales = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id, startDate, endDate } = props || ""

  const query: UseQueryResult<ISaleFullRelated[], Error> = useQuery({
    queryKey: [
      "sales",
      {
        filters: { startDate, endDate, id },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as IFilters
      const { data } = await saleService.getAll({ ...filters }, axiosPrivate)
      return data
    },
    staleTime: Infinity,
  })

  return query
}
