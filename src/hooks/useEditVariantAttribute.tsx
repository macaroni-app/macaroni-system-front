import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IVariantAttribute } from "../components/variantAttributes/types"
import useAxiosPrivate from "./useAxiosPrivate"
import variantAttributeService from "../services/variantAttribute"

interface Props {
  variantAttributeId: string
  variantAttributeToUpdate: IVariantAttribute
}

export const useEditVariantAttribute = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editVariantAttribute } = useMutation({
    mutationFn: ({ variantAttributeId, variantAttributeToUpdate }: Props) =>
      variantAttributeService.update(
        variantAttributeId,
        variantAttributeToUpdate,
        axiosPrivate,
      ),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["variantAttributes"] })
    },
  })

  return { editVariantAttribute }
}
