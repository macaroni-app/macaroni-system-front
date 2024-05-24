import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IUser } from "../components/users/types"

import userService from "../services/user"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: (userId: string) => {
      return userService.delete(userId, axiosPrivate)
    },
    onMutate: async (userId) => {
      queryClient.cancelQueries({ queryKey: ["users"] })

      const previousUsers = queryClient.getQueryData<IUser>(["users"])

      queryClient.setQueryData(["users"], (oldData: IUser[]) => {
        if (oldData == null) return []
        return [...oldData.filter((c) => c._id !== userId)]
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

  return { deleteUser }
}
