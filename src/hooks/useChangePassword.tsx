import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IUserLessRelated } from "../components/users/types"

import userService from "../services/user"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  userId: string
  userToUpdate: IUserLessRelated
}

export const useChangePassword = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: changePassword } = useMutation({
    mutationFn: ({ userId, userToUpdate }: Props) =>
      userService.changePassword(userId, userToUpdate, axiosPrivate),
    onMutate: async (userToUpdate) => {
      queryClient.cancelQueries({ queryKey: ["users"] })

      const previousUsers = queryClient.getQueryData<IUserLessRelated>([
        "users",
      ])

      queryClient.setQueryData(["users"], (oldData: IUserLessRelated[]) => {
        if (oldData == null) return [userToUpdate]
        return [userToUpdate, ...oldData]
      })

      return { previousUsers }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousUsers != null) {
        queryClient.setQueryData(["users"], context.previousUsers)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  return { changePassword }
}
