import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"

// types
import { IInventoryTransactionFullRelated } from "../components/inventoryTransactions/types"
import { IFilters } from "../components/common/types"

// services
import inventoryTransactionService from "../services/inventoryTransaction"

// hooks
import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  id?: string
}

export const useInventoryTransactions = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id } = props || ""

  const query: UseQueryResult<IInventoryTransactionFullRelated[], Error> =
    useQuery({
      queryKey: [
        "inventoryTransactions",
        {
          filters: { id },
        },
      ],
      queryFn: async ({ queryKey }: QueryFunctionContext) => {
        const { filters } = queryKey[1] as IFilters
        const { data } = await inventoryTransactionService.getAll(
          { ...filters },
          axiosPrivate
        )
        return data
      },
      staleTime: Infinity,
    })

  return query
}
