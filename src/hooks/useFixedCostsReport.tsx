import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"

// types
import { IFixedCost } from "../components/fixedCosts/types"
import { IFilters } from "../components/common/types"

// services
import reportsService from "../services/reports"

// hooks
import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  id?: string
  historyMonthToRetrieve?: number
}

export const useFixedCostsReport = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id, historyMonthToRetrieve } = props || ""


  const query: UseQueryResult<IFixedCost[], Error> = useQuery({
    queryKey: [
      "reportFixedCosts",
      {
        filters: { id, historyMonthToRetrieve },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as IFilters

      const { data } = await reportsService.getAllFixedCosts(
        { ...filters },
        axiosPrivate
      )
      return data
    },
    staleTime: Infinity,
  })

  return query
}
