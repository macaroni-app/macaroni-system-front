import { AxiosInstance } from "axios"

const PRODUCT_ITEM_URL = "/api/v1/productItems"

interface IProductItem {
  asset?: string
  product?: string
  quantity?: Number
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

const productItemService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${PRODUCT_ITEM_URL}?id=${filters.id}`
    } else {
      finalUrl = PRODUCT_ITEM_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${PRODUCT_ITEM_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (newProductItem: IProductItem, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(PRODUCT_ITEM_URL, newProductItem, {
      withCredentials: true,
    })
    return data
  },
  storeMany: async (
    newProductItems: IProductItem[],
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.post(
      PRODUCT_ITEM_URL + "/bulk",
      { productItems: newProductItems },
      {
        withCredentials: true,
      }
    )
    return data
  },
  delete: async (id: string | undefined, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${PRODUCT_ITEM_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  update: async (
    id: string,
    productToUpdate: IProductItem,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${PRODUCT_ITEM_URL}/${id}`,
      productToUpdate,
      {
        withCredentials: true,
      }
    )
    return data
  },
}

export default productItemService
