import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IAssetWithCategory } from "../components/assets/types"

import assetService from "../services/asset"

import useAxiosPrivate from "./useAxiosPrivate"

export const useNewAsset = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewAsset } = useMutation({
    mutationFn: (newAsset: IAssetWithCategory) =>
      assetService.store(newAsset, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] })
    },
  })

  return { addNewAsset }
}
