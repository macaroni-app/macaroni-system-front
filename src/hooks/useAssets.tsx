// libs
import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"

// types
import { IAsset } from "../components/assets/types"
import { IFilters } from "../components/common/types"

// services
import assetService from "../services/asset"

// hooks
import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  id?: string
}

export const useAssets = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id } = props || ""

  const query: UseQueryResult<IAsset[], Error> = useQuery({
    queryKey: [
      "assets",
      {
        filters: { id },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as IFilters
      const { data } = await assetService.getAll({ ...filters }, axiosPrivate)
      return data
    },
    staleTime: Infinity,
  })

  return query
}
