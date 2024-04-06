import { AxiosInstance } from "axios"

const PRODUCT_TYPE_URL = "/api/v1/productTypes"

interface IProductType {
  name?: string
  isActive?: boolean
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
  store: async (newProductType: IProductType, axiosPrivate: AxiosInstance) => {
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
    productTypeToUpdate: IProductType,
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
}

export default productTypeService
