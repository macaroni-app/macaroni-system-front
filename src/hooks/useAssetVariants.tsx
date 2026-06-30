import { QueryFunctionContext, useQuery, UseQueryResult } from "@tanstack/react-query"
import { IAssetVariant } from "../components/assetVariants/types"
import useAxiosPrivate from "./useAxiosPrivate"
import assetVariantService from "../services/assetVariant"

interface Props {
  id?: string
  baseAsset?: string
}

export const useAssetVariants = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id, baseAsset } = props || {}

  return useQuery({
    queryKey: [
      "assetVariants",
      {
        filters: { id, baseAsset },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as { filters: Props }
      const { data } = await assetVariantService.getAll(
        { ...filters },
        axiosPrivate,
      )
      return data as IAssetVariant[]
    },
    staleTime: Infinity,
  }) as UseQueryResult<IAssetVariant[], Error>
}
