import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ICategory } from "../components/categories/types"

import categoryService from "../services/category"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

interface Props {
  categoryId: string
  categoryToUpdate: ICategory
}

export const useEditCategory = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editCategory } = useMutation({
    mutationFn: ({ categoryId, categoryToUpdate }: Props) =>
      categoryService.update(categoryId, categoryToUpdate, axiosPrivate),
    onMutate: async (categoryToUpdate) => {
      queryClient.cancelQueries({ queryKey: ["categories"] })

      const previousCategories = queryClient.getQueryData<ICategory>([
        "categories",
      ])

      queryClient.setQueryData(["categories"], (oldData: ICategory[]) => {
        if (oldData == null) return [categoryToUpdate]
        return [categoryToUpdate, ...oldData]
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

  return { editCategory }
}
