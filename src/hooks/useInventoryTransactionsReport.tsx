import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"

// types
import { IInventoryTransactionFullRelated } from "../components/inventoryTransactions/types"
import { IFilters } from "../components/common/types"

// services
import reportsService from "../services/reports"

// hooks
import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  id?: string
  historyMonthToRetrieve?: number
}

export const useInventoryTransactionsReport = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id, historyMonthToRetrieve } = props || ""

  const query: UseQueryResult<IInventoryTransactionFullRelated[], Error> =
    useQuery({
      queryKey: [
        "reportInventoryTransactions",
        {
          filters: { id, historyMonthToRetrieve },
        },
      ],
      queryFn: async ({ queryKey }: QueryFunctionContext) => {
        const { filters } = queryKey[1] as IFilters
        const { data } = await reportsService.getAllInventoryTransactions(
          { ...filters },
          axiosPrivate
        )
        return data
      },
      staleTime: Infinity,
    })

  return query
}
