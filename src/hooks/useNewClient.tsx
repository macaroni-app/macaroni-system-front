import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IClient } from "../components/clients/types"

import clientService from "../services/client"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useNewClient = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewClient } = useMutation({
    mutationFn: (newClient: IClient) =>
      clientService.store(newClient, axiosPrivate),
    onMutate: async (newClient) => {
      queryClient.cancelQueries({ queryKey: ["clients"] })

      const previousClients = queryClient.getQueryData<IClient>(["clients"])

      queryClient.setQueryData(["clients"], (oldData: IClient[]) => {
        if (oldData == null) return [newClient]
        return [newClient, ...oldData]
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

  return { addNewClient }
}
