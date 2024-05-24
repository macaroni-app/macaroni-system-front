import { useMutation, useQueryClient } from "@tanstack/react-query"

import userService from "../services/user"

import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  userId: string
  isActive: boolean
}

export const useChangeIsActiveUser = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: changeIsActiveUser } = useMutation({
    mutationFn: ({ userId, isActive }: Props) => {
      return userService.changeIsActive(userId, isActive, axiosPrivate)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  return { changeIsActiveUser }
}
