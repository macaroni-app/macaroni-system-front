import { AxiosInstance } from "axios"
import { IProductTypeType } from "../components/productTypes/types"

const PRODUCT_TYPE_URL = "/api/v1/productTypes"

interface IFilters {
  id?: string
}

const productTypeService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${PRODUCT_TYPE_URL}?id=${filters.id}`
    } else {
      finalUrl = PRODUCT_TYPE_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${PRODUCT_TYPE_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (
    newProductType: IProductTypeType,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.post(PRODUCT_TYPE_URL, newProductType, {
      withCredentials: true,
    })
    return data
  },
  delete: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${PRODUCT_TYPE_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  update: async (
    id: string,
    productTypeToUpdate: IProductTypeType,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${PRODUCT_TYPE_URL}/${id}`,
      productTypeToUpdate,
      {
        withCredentials: true,
      }
    )
    return data
  },
  changeIsActive: async (
    id: string,
    isActive: boolean,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${PRODUCT_TYPE_URL}/soft-delete/${id}`,
      { isActive },
      {
        withCredentials: true,
      }
    )

    return data
  },
}

export default productTypeService
