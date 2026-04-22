import { useMutation, useQueryClient } from "@tanstack/react-query"
import { IProductBulkPriceUpdate } from "../components/products/types"
import productService from "../services/product"
import useAxiosPrivate from "./useAxiosPrivate"

export const useEditManyProductPrices = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()

  const { mutateAsync: editManyProductPrices } = useMutation({
    mutationFn: (products: IProductBulkPriceUpdate[]) =>
      productService.updateManyPrices(products, axiosPrivate),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  return { editManyProductPrices }
}
