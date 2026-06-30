import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IVariantAttributeValue } from "../components/variantAttributeValues/types"
import useAxiosPrivate from "./useAxiosPrivate"
import variantAttributeValueService from "../services/variantAttributeValue"

interface Props {
  variantAttributeValueId: string
  variantAttributeValueToUpdate: IVariantAttributeValue
}

export const useEditVariantAttributeValue = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editVariantAttributeValue } = useMutation({
    mutationFn: ({
      variantAttributeValueId,
      variantAttributeValueToUpdate,
    }: Props) =>
      variantAttributeValueService.update(
        variantAttributeValueId,
        variantAttributeValueToUpdate,
        axiosPrivate,
      ),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["variantAttributeValues"] })
    },
  })

  return { editVariantAttributeValue }
}
