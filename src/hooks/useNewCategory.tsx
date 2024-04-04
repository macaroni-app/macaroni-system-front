import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ICategory } from "../components/categories/types"

import categoryService from "../services/category"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useNewCategory = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewCategory } = useMutation({
    mutationFn: (newCategory: ICategory) =>
      categoryService.store(newCategory, axiosPrivate),
    onMutate: async (newCategory) => {
      queryClient.cancelQueries({ queryKey: ["categories"] })

      const previousCategories = queryClient.getQueryData<ICategory>([
        "categories",
      ])

      queryClient.setQueryData(["categories"], (oldData: ICategory[]) => {
        if (oldData == null) return [newCategory]
        return [newCategory, ...oldData]
      })

      return { previousCategories }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCategories != null) {
        queryClient.setQueryData(["categories"], context.previousCategories)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })

  return { addNewCategory }
}
