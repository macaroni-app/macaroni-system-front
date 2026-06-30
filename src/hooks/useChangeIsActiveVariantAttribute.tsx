import { useMutation, useQueryClient } from "@tanstack/react-query"
import useAxiosPrivate from "./useAxiosPrivate"
import variantAttributeService from "../services/variantAttribute"

interface Props {
  variantAttributeId: string
  isActive: boolean
}

export const useChangeIsActiveVariantAttribute = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: changeIsActiveVariantAttribute } = useMutation({
    mutationFn: ({ variantAttributeId, isActive }: Props) =>
      variantAttributeService.changeIsActive(
        variantAttributeId,
        isActive,
        axiosPrivate,
      ),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["variantAttributes"] })
    },
  })

  return { changeIsActiveVariantAttribute }
}
