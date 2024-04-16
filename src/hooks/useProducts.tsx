// libs
import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"

// types
import { IProductFullRelated } from "../components/products/types"
import { IFilters } from "../components/common/types"

// services
import productService from "../services/product"

// hooks
import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  id?: string
}

export const useProducts = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id } = props || ""

  const query: UseQueryResult<IProductFullRelated[], Error> = useQuery({
    queryKey: [
      "products",
      {
        filters: { id },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as IFilters
      const { data } = await productService.getAll({ ...filters }, axiosPrivate)
      return data
    },
    staleTime: Infinity,
  })

  return query
}
