import { useMutation, useQueryClient } from "@tanstack/react-query"

import { IAssetLessCategory } from "../components/assets/types"

import assetService from "../services/asset"

import useAxiosPrivate from "./useAxiosPrivate"

export const useNewAsset = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: addNewAsset } = useMutation({
    mutationFn: (newAsset: IAssetLessCategory) =>
      assetService.store(newAsset, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] })
    },
  })

  return { addNewAsset }
}
