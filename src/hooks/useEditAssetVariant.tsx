import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IAssetVariant } from "../components/assetVariants/types"
import useAxiosPrivate from "./useAxiosPrivate"
import assetVariantService from "../services/assetVariant"

interface Props {
  assetVariantId: string
  assetVariantToUpdate: IAssetVariant
}

export const useEditAssetVariant = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editAssetVariant } = useMutation({
    mutationFn: ({ assetVariantId, assetVariantToUpdate }: Props) =>
      assetVariantService.update(
        assetVariantId,
        assetVariantToUpdate,
        axiosPrivate,
      ),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assetVariants"] })
    },
  })

  return { editAssetVariant }
}
