import { useMutation, useQueryClient } from "@tanstack/react-query"
import useAxiosPrivate from "./useAxiosPrivate"
import variantAttributeValueService from "../services/variantAttributeValue"

interface Props {
  variantAttributeValueId: string
  isActive: boolean
}

export const useChangeIsActiveVariantAttributeValue = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: changeIsActiveVariantAttributeValue } = useMutation({
    mutationFn: ({ variantAttributeValueId, isActive }: Props) =>
      variantAttributeValueService.changeIsActive(
        variantAttributeValueId,
        isActive,
        axiosPrivate,
      ),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["variantAttributeValues"] })
    },
  })

  return { changeIsActiveVariantAttributeValue }
}
