import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IVariantAttributeValue } from "../components/variantAttributeValues/types"
import useAxiosPrivate from "./useAxiosPrivate"
import variantAttributeValueService from "../services/variantAttributeValue"

export const useNewVariantAttributeValue = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewVariantAttributeValue } = useMutation({
    mutationFn: (payload: IVariantAttributeValue) =>
      variantAttributeValueService.store(payload, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["variantAttributeValues"] })
    },
  })

  return { addNewVariantAttributeValue }
}
