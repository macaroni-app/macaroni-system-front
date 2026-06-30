import { useMutation, useQueryClient } from "@tanstack/react-query"
import useAxiosPrivate from "./useAxiosPrivate"
import variantAttributeService from "../services/variantAttribute"

export const useDeleteVariantAttribute = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteVariantAttribute } = useMutation({
    mutationFn: (variantAttributeId: string) =>
      variantAttributeService.delete(variantAttributeId, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["variantAttributes"] })
    },
  })

  return { deleteVariantAttribute }
}
