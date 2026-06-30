import { QueryFunctionContext, useQuery, UseQueryResult } from "@tanstack/react-query"
import { IVariantAttributeValue } from "../components/variantAttributeValues/types"
import useAxiosPrivate from "./useAxiosPrivate"
import variantAttributeValueService from "../services/variantAttributeValue"

interface Props {
  id?: string
  attribute?: string
}

export const useVariantAttributeValues = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id, attribute } = props || {}

  return useQuery({
    queryKey: [
      "variantAttributeValues",
      {
        filters: { id, attribute },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as { filters: Props }
      const { data } = await variantAttributeValueService.getAll(
        { ...filters },
        axiosPrivate,
      )
      return data as IVariantAttributeValue[]
    },
    staleTime: Infinity,
  }) as UseQueryResult<IVariantAttributeValue[], Error>
}
