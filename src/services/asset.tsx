import { AxiosInstance } from "axios"

const ASSET_URL = "/api/v1/assets"

interface IAsset {
  name?: string
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  createdBy?: string
  updatedBy?: string
}

interface IFilters {
  id?: string
}

const assetService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${ASSET_URL}?id=${filters.id}`
    } else {
      finalUrl = ASSET_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${ASSET_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (newAsset: IAsset, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(ASSET_URL, newAsset, {
      withCredentials: true,
    })
    return data
  },
  delete: async (id: string | undefined, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${ASSET_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  update: async (
    id: string,
    assetToUpdate: IAsset,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${ASSET_URL}/${id}`,
      assetToUpdate,
      {
        withCredentials: true,
      }
    )
    return data
  },
}

export default assetService