import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IInvoice } from "../components/afip/types"

import invoiceService from "../services/invoice"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useNewInvoice = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: generateInvoice } = useMutation({
    mutationFn: (newInvoice: IInvoice) =>
      invoiceService.generateInvoice(newInvoice, axiosPrivate),
    onMutate: async (newInvoice) => {
      queryClient.cancelQueries({ queryKey: ["invoices"] })

      const previousInvoices = queryClient.getQueryData<IInvoice>(["invoices"])

      queryClient.setQueryData(["invoices"], (oldData: IInvoice[]) => {
        if (oldData == null) return [newInvoice]
        return [newInvoice, ...oldData]
      })

      return { previousInvoices }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousInvoices != null) {
        queryClient.setQueryData(["invoices"], context.previousInvoices)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
  })

  return { generateInvoice }
}
