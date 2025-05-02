// libs
import {
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"

// services
import invoiceService from "../services/invoice"

// hooks
import useAxiosPrivate from "./useAxiosPrivate"

export interface IDocumentTypes {
  id?: string
  name?: string
}


export const useDocumentTypes = () => {
  const axiosPrivate = useAxiosPrivate()


  const query: UseQueryResult<IDocumentTypes, Error> = useQuery({
    queryKey: [
      "documentTypes",
    ],
    queryFn: async () => {
      const { data } = await invoiceService.getDocumentTypes(axiosPrivate)
      return data
    },
    staleTime: Infinity,
  })

  return query
}
