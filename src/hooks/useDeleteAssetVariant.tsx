import { useMutation, useQueryClient } from "@tanstack/react-query"
import useAxiosPrivate from "./useAxiosPrivate"
import assetVariantService from "../services/assetVariant"

export const useDeleteAssetVariant = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteAssetVariant } = useMutation({
    mutationFn: (assetVariantId: string) =>
      assetVariantService.delete(assetVariantId, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assetVariants"] })
    },
  })

  return { deleteAssetVariant }
}
