import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IClient } from "../components/clients/types"

import clientService from "../services/client"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  clientId: string
  clientToUpdate: IClient
}

export const useEditClient = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editClient } = useMutation({
    mutationFn: ({ clientId, clientToUpdate }: Props) =>
      clientService.update(clientId, clientToUpdate, axiosPrivate),
    onMutate: async (clientToUpdate) => {
      queryClient.cancelQueries({ queryKey: ["clients"] })

      const previousClients = queryClient.getQueryData<IClient>(["clients"])

      queryClient.setQueryData(["clients"], (oldData: IClient[]) => {
        if (oldData == null) return [clientToUpdate]
        return [clientToUpdate, ...oldData]
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

  return { editClient }
}
