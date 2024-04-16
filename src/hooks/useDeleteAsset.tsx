import { useMutation, useQueryClient } from "@tanstack/react-query"

import assetService from "../services/asset"

import useAxiosPrivate from "./useAxiosPrivate"

import { IAssetFullCategory } from "../components/assets/types"

interface Props {
  assetId?: string
}

export const useDeleteAsset = () => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: deleteAsset } = useMutation({
    mutationFn: ({ assetId }: Props) => {
      return assetService.delete(assetId, axiosPrivate)
    },
    onMutate: async (assetToDelete) => {
      queryClient.cancelQueries({ queryKey: ["assets"] })

      const previousAssets = queryClient.getQueryData<IAssetFullCategory>([
        "assets",
      ])

      queryClient.setQueryData(["assets"], (oldData: IAssetFullCategory[]) => {
        if (oldData == null) return []
        return [...oldData.filter((c) => c._id !== assetToDelete)]
      })

      return { previousAssets }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousAssets != null) {
        queryClient.setQueryData(["assets"], context.previousAssets)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] })
    },
  })

  return { deleteAsset }
}
