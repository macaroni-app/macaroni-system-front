import { AxiosInstance } from "axios"
import { IProductLessRelated } from "../components/products/types"

const PRODUCT_URL = "/api/v1/products"

interface IFilters {
  id?: string
}

const productService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${PRODUCT_URL}?id=${filters.id}`
    } else {
      finalUrl = PRODUCT_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${PRODUCT_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (
    newProduct: IProductLessRelated,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.post(PRODUCT_URL, newProduct, {
      withCredentials: true,
    })
    return data
  },
  delete: async (id: string | undefined, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${PRODUCT_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  update: async (
    id: string,
    productToUpdate: IProductLessRelated,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${PRODUCT_URL}/${id}`,
      productToUpdate,
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
      `${PRODUCT_URL}/soft-delete/${id}`,
      { isActive },
      {
        withCredentials: true,
      }
    )

    return data
  },
}

export default productService
