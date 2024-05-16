import { useMutation, useQueryClient } from "@tanstack/react-query"

import categoryService from "../services/category"

import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  categoryId: string
  isActive: boolean
}

export const useChangeIsActiveCategory = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: changeIsActiveCategory } = useMutation({
    mutationFn: ({ categoryId, isActive }: Props) => {
      return categoryService.changeIsActive(categoryId, isActive, axiosPrivate)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })

  return { changeIsActiveCategory }
}
