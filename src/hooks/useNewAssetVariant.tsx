import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IAssetVariant } from "../components/assetVariants/types"
import useAxiosPrivate from "./useAxiosPrivate"
import assetVariantService from "../services/assetVariant"

export const useNewAssetVariant = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewAssetVariant } = useMutation({
    mutationFn: (payload: IAssetVariant) =>
      assetVariantService.store(payload, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assetVariants"] })
    },
  })

  return { addNewAssetVariant }
}
