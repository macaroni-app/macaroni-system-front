// libs
import {
  QueryFunctionContext,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query"

// services
import invoiceService from "../services/invoice"

// hooks
import useAxiosPrivate from "./useAxiosPrivate"
import { IInvoice } from "../components/afip/types"

interface Props {
  saleId?: string
}

export const useInvoices = (props: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const { saleId } = props || ""


  const query: UseQueryResult<IInvoice, Error> = useQuery({
    queryKey: [
      "invoice",
      {
        filters: { saleId },
      },
    ],
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const { filters } = queryKey[1] as { filters: { saleId: string } }
      const { data } = await invoiceService.getOne(filters.saleId, axiosPrivate)
      return data
    },
    staleTime: Infinity,
  })

  return query
}
