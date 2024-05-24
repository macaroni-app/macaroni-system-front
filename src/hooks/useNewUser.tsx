import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IUser } from "../components/users/types"

import userService from "../services/user"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useNewUser = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewUser } = useMutation({
    mutationFn: (newUser: IUser) => userService.store(newUser, axiosPrivate),
    onMutate: async (newUser) => {
      queryClient.cancelQueries({ queryKey: ["users"] })

      const previousUsers = queryClient.getQueryData<IUser>(["users"])

      queryClient.setQueryData(["users"], (oldData: IUser[]) => {
        if (oldData == null) return [newUser]
        return [newUser, ...oldData]
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

  return { addNewUser }
}
