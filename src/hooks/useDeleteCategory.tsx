import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ICategory } from "../components/categories/types"

import categoryService from "../services/category"

import useAxiosPrivate from "../hooks/useAxiosPrivate"

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteCategory } = useMutation({
    mutationFn: (categoryId: string) => {
      return categoryService.delete(categoryId, axiosPrivate)
    },
    onMutate: async (categoryId) => {
      queryClient.cancelQueries({ queryKey: ["categories"] })

      const previousCategories = queryClient.getQueryData<ICategory>([
        "categories",
      ])

      queryClient.setQueryData(["categories"], (oldData: ICategory[]) => {
        if (oldData == null) return []
        return [...oldData.filter((c) => c._id !== categoryId)]
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

  return { deleteCategory }
}
