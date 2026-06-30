import { useMutation, useQueryClient } from "@tanstack/react-query"
import useAxiosPrivate from "./useAxiosPrivate"
import variantAttributeValueService from "../services/variantAttributeValue"

export const useDeleteVariantAttributeValue = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteVariantAttributeValue } = useMutation({
    mutationFn: (variantAttributeValueId: string) =>
      variantAttributeValueService.delete(variantAttributeValueId, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["variantAttributeValues"] })
    },
  })

  return { deleteVariantAttributeValue }
}
