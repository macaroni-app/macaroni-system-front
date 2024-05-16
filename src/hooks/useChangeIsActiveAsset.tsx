import { useMutation, useQueryClient } from "@tanstack/react-query"

import assetService from "../services/asset"

import useAxiosPrivate from "./useAxiosPrivate"

interface Props {
  assetId: string
  isActive: boolean
}

export const useChangeIsActiveAsset = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: changeIsActiveAsset } = useMutation({
    mutationFn: ({ assetId, isActive }: Props) => {
      return assetService.changeIsActive(assetId, isActive, axiosPrivate)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] })
    },
  })

  return { changeIsActiveAsset }
}
