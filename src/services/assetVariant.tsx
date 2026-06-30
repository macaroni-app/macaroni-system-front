import { AxiosInstance } from "axios"
import { IAssetVariant } from "../components/assetVariants/types"

const ASSET_VARIANT_URL = "/api/v1/assetVariants"

interface IFilters {
  id?: string
  baseAsset?: string
}

const assetVariantService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    const searchParams = new URLSearchParams()
    if (filters.id) searchParams.set("id", filters.id)
    if (filters.baseAsset) searchParams.set("baseAsset", filters.baseAsset)

    const queryString = searchParams.toString()
    const finalUrl = queryString
      ? `${ASSET_VARIANT_URL}?${queryString}`
      : ASSET_VARIANT_URL

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })

    return data
  },
  store: async (payload: IAssetVariant, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(ASSET_VARIANT_URL, payload, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${ASSET_VARIANT_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  update: async (
    id: string,
    payload: IAssetVariant,
    axiosPrivate: AxiosInstance,
  ) => {
    const { data } = await axiosPrivate.put(
      `${ASSET_VARIANT_URL}/${id}`,
      payload,
      {
        withCredentials: true,
      },
    )
    return data
  },
  delete: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${ASSET_VARIANT_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  changeIsActive: async (
    id: string,
    isActive: boolean,
    axiosPrivate: AxiosInstance,
  ) => {
    const { data } = await axiosPrivate.put(
      `${ASSET_VARIANT_URL}/soft-delete/${id}`,
      { isActive },
      {
        withCredentials: true,
      },
    )
    return data
  },
}

export default assetVariantService
