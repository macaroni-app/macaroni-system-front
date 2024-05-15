import { useMutation, useQueryClient } from "@tanstack/react-query"

import clientService from "../services/client"

import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  clientId: string
  isActive: boolean
}

export const useChangeIsActiveClient = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: changeIsActiveClient } = useMutation({
    mutationFn: ({ clientId, isActive }: Props) => {
      return clientService.changeIsActive(clientId, isActive, axiosPrivate)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },
  })

  return { changeIsActiveClient }
}
