import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IClient } from "../components/clients/types"

import clientService from "../services/client"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useDeleteClient = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteClient } = useMutation({
    mutationFn: (clientId: string) => {
      return clientService.delete(clientId, axiosPrivate)
    },
    onMutate: async (clientId) => {
      queryClient.cancelQueries({ queryKey: ["clients"] })

      const previousClients = queryClient.getQueryData<IClient>(["clients"])

      queryClient.setQueryData(["clients"], (oldData: IClient[]) => {
        if (oldData == null) return []
        return [...oldData.filter((c) => c._id !== clientId)]
      })

      return { previousClients }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousClients != null) {
        queryClient.setQueryData(["clients"], context.previousClients)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },
  })

  return { deleteClient }
}
