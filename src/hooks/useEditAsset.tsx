import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IAssetWithCategory } from "../components/assets/types"

import assetService from "../services/asset"

import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  assetId: string
  assetToUpdate: IAssetWithCategory
}

export const useEditAsset = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editAsset } = useMutation({
    mutationFn: ({ assetId, assetToUpdate }: Props) =>
      assetService.update(assetId, assetToUpdate, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] })
    },
  })

  return { editAsset }
}
