import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"

// types
import { IInventoryFullRelated } from "../components/inventories/types"
import { IFilters } from "../components/common/types"

// services
import inventoryService from "../services/inventory"

// hooks
import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  id?: string
}

export const useInventories = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id } = props || ""

  const query: UseQueryResult<IInventoryFullRelated[], Error> = useQuery({
    queryKey: [
      "inventories",
      {
        filters: { id },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as IFilters
      const { data } = await inventoryService.getAll(
        { ...filters },
        axiosPrivate
      )
      return data
    },
    staleTime: 0,
  })

  return query
}
