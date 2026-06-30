import { AxiosInstance } from "axios"
import { IVariantAttributeValue } from "../components/variantAttributeValues/types"

const VARIANT_ATTRIBUTE_VALUE_URL = "/api/v1/variantAttributeValues"

interface IFilters {
  id?: string
  attribute?: string
}

const variantAttributeValueService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    const searchParams = new URLSearchParams()
    if (filters.id) searchParams.set("id", filters.id)
    if (filters.attribute) searchParams.set("attribute", filters.attribute)

    const queryString = searchParams.toString()
    const finalUrl = queryString
      ? `${VARIANT_ATTRIBUTE_VALUE_URL}?${queryString}`
      : VARIANT_ATTRIBUTE_VALUE_URL

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })

    return data
  },
  store: async (payload: IVariantAttributeValue, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(
      VARIANT_ATTRIBUTE_VALUE_URL,
      payload,
      {
        withCredentials: true,
      },
    )
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(
      `${VARIANT_ATTRIBUTE_VALUE_URL}/${id}`,
      {
        withCredentials: true,
      },
    )
    return data
  },
  update: async (
    id: string,
    payload: IVariantAttributeValue,
    axiosPrivate: AxiosInstance,
  ) => {
    const { data } = await axiosPrivate.put(
      `${VARIANT_ATTRIBUTE_VALUE_URL}/${id}`,
      payload,
      {
        withCredentials: true,
      },
    )
    return data
  },
  delete: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(
      `${VARIANT_ATTRIBUTE_VALUE_URL}/${id}`,
      {
        withCredentials: true,
      },
    )
    return data
  },
  changeIsActive: async (
    id: string,
    isActive: boolean,
    axiosPrivate: AxiosInstance,
  ) => {
    const { data } = await axiosPrivate.put(
      `${VARIANT_ATTRIBUTE_VALUE_URL}/soft-delete/${id}`,
      { isActive },
      {
        withCredentials: true,
      },
    )
    return data
  },
}

export default variantAttributeValueService
