import { useMutation, useQueryClient } from "@tanstack/react-query"
import useAxiosPrivate from "./useAxiosPrivate"
import assetVariantService from "../services/assetVariant"

interface Props {
  assetVariantId: string
  isActive: boolean
}

export const useChangeIsActiveAssetVariant = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: changeIsActiveAssetVariant } = useMutation({
    mutationFn: ({ assetVariantId, isActive }: Props) =>
      assetVariantService.changeIsActive(
        assetVariantId,
        isActive,
        axiosPrivate,
      ),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assetVariants"] })
    },
  })

  return { changeIsActiveAssetVariant }
}
