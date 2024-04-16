import { AxiosInstance } from "axios"
import { IProductItemLessRelated } from "../components/products/types"

const PRODUCT_ITEM_URL = "/api/v1/productItems"

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
  store: async (
    newProductItem: IProductItemLessRelated,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.post(PRODUCT_ITEM_URL, newProductItem, {
      withCredentials: true,
    })
    return data
  },
  storeMany: async (
    newProductItems: IProductItemLessRelated[],
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.post(
      PRODUCT_ITEM_URL + "/bulkCreate",
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
  deleteMany: async (
    productItemsToDelete: IProductItemLessRelated[],
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${PRODUCT_ITEM_URL}/bulkDelete`,
      { productItems: productItemsToDelete },
      {
        withCredentials: true,
      }
    )
    return data
  },
  updateMany: async (
    productItemsToUpdate: IProductItemLessRelated[],
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      PRODUCT_ITEM_URL + "/bulkUpdate",
      { productItems: productItemsToUpdate },
      {
        withCredentials: true,
      }
    )
    return data
  },
  update: async (
    id: string,
    productToUpdate: IProductItemLessRelated,
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
