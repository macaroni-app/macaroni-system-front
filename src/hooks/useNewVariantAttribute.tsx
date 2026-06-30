import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IVariantAttribute } from "../components/variantAttributes/types"
import useAxiosPrivate from "./useAxiosPrivate"
import variantAttributeService from "../services/variantAttribute"

export const useNewVariantAttribute = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewVariantAttribute } = useMutation({
    mutationFn: (payload: IVariantAttribute) =>
      variantAttributeService.store(payload, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["variantAttributes"] })
    },
  })

  return { addNewVariantAttribute }
}
