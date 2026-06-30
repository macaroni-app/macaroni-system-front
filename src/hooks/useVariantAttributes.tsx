import { QueryFunctionContext, useQuery, UseQueryResult } from "@tanstack/react-query"
import { IFilters } from "../components/common/types"
import { IVariantAttribute } from "../components/variantAttributes/types"
import useAxiosPrivate from "./useAxiosPrivate"
import variantAttributeService from "../services/variantAttribute"

interface Props {
  id?: string
}

export const useVariantAttributes = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id } = props || ""

  return useQuery({
    queryKey: [
      "variantAttributes",
      {
        filters: { id },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as IFilters
      const { data } = await variantAttributeService.getAll(
        { ...filters },
        axiosPrivate,
      )
      return data as IVariantAttribute[]
    },
    staleTime: Infinity,
  }) as UseQueryResult<IVariantAttribute[], Error>
}
