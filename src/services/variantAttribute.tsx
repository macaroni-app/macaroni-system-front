import { AxiosInstance } from "axios"
import { IVariantAttribute } from "../components/variantAttributes/types"

const VARIANT_ATTRIBUTE_URL = "/api/v1/variantAttributes"

interface IFilters {
  id?: string
}

const variantAttributeService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    const finalUrl = filters.id
      ? `${VARIANT_ATTRIBUTE_URL}?id=${filters.id}`
      : VARIANT_ATTRIBUTE_URL

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })

    return data
  },
  store: async (payload: IVariantAttribute, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(VARIANT_ATTRIBUTE_URL, payload, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${VARIANT_ATTRIBUTE_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  update: async (
    id: string,
    payload: IVariantAttribute,
    axiosPrivate: AxiosInstance,
  ) => {
    const { data } = await axiosPrivate.put(
      `${VARIANT_ATTRIBUTE_URL}/${id}`,
      payload,
      {
        withCredentials: true,
      },
    )
    return data
  },
  delete: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${VARIANT_ATTRIBUTE_URL}/${id}`, {
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
      `${VARIANT_ATTRIBUTE_URL}/soft-delete/${id}`,
      { isActive },
      {
        withCredentials: true,
      },
    )
    return data
  },
}

export default variantAttributeService
