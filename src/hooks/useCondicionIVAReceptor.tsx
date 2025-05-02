// libs
import {
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"

// services
import invoiceService from "../services/invoice"

// hooks
import useAxiosPrivate from "./useAxiosPrivate"

export interface ICondicionIVAReceptor {
  id?: string
  name?: string
}


export const useCondicionIvaReceptor = () => {
  const axiosPrivate = useAxiosPrivate()


  const query: UseQueryResult<ICondicionIVAReceptor, Error> = useQuery({
    queryKey: [
      "condicionIvaReceptor",
    ],
    queryFn: async () => {
      const { data } = await invoiceService.getCondicionIvaReceptor(axiosPrivate)
      return data
    },
    staleTime: Infinity,
  })

  return query
}
