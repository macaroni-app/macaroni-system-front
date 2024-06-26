// libs
import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"

// types
import { IProductItemFullRelated } from "../components/products/types"
import { IFilters } from "../components/common/types"

// services
import productItemService from "../services/productItem"

// hooks
import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  id?: string
}

export const useProductItems = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id } = props || ""

  const query: UseQueryResult<IProductItemFullRelated[], Error> = useQuery({
    queryKey: [
      "productItems",
      {
        filters: { id },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as IFilters
      const { data } = await productItemService.getAll(
        { ...filters },
        axiosPrivate
      )
      return data
    },
    staleTime: Infinity,
  })

  return query
}
