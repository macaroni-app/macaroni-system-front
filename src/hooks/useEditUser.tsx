import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IUser } from "../components/users/types"

import userService from "../services/user"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  userId: string
  userToUpdate: IUser
}

export const useEditUser = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editUser } = useMutation({
    mutationFn: ({ userId, userToUpdate }: Props) =>
      userService.update(userId, userToUpdate, axiosPrivate),
    onMutate: async (userToUpdate) => {
      queryClient.cancelQueries({ queryKey: ["users"] })

      const previousUsers = queryClient.getQueryData<IUser>(["users"])

      queryClient.setQueryData(["users"], (oldData: IUser[]) => {
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

  return { editUser }
}
