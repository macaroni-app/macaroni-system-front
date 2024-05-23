import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"

// types
import { IUser } from "../components/users/types"
import { IFilters } from "../components/common/types"

// services
import userService from "../services/user"

// hooks
import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  id?: string
}

export const useUsers = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { id } = props || ""

  const query: UseQueryResult<IUser[], Error> = useQuery({
    queryKey: [
      "users",
      {
        filters: { id },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as IFilters
      const { data } = await userService.getAll({ ...filters }, axiosPrivate)
      return data
    },
    staleTime: Infinity,
  })

  return query
}
