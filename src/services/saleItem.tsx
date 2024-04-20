import { AxiosInstance } from "axios"
import { ISaleItemLessRelated } from "../components/sales/types"

const SALE_ITEM_URL = "/api/v1/saleItems"

interface IFilters {
  id?: string
}

const saleItemService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${SALE_ITEM_URL}?id=${filters.id}`
    } else {
      finalUrl = SALE_ITEM_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${SALE_ITEM_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (
    newSaleItem: ISaleItemLessRelated,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.post(SALE_ITEM_URL, newSaleItem, {
      withCredentials: true,
    })
    return data
  },
  storeMany: async (
    newSaleItems: ISaleItemLessRelated[],
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.post(
      SALE_ITEM_URL + "/bulkCreate",
      { saleItems: newSaleItems },
      {
        withCredentials: true,
      }
    )
    return data
  },
  delete: async (id: string | undefined, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${SALE_ITEM_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  deleteMany: async (
    saleItemsToDelete: ISaleItemLessRelated[],
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${SALE_ITEM_URL}/bulkDelete`,
      { saleItems: saleItemsToDelete },
      {
        withCredentials: true,
      }
    )
    return data
  },
  updateMany: async (
    saleItemsToUpdate: ISaleItemLessRelated[],
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      SALE_ITEM_URL + "/bulkUpdate",
      { saleItems: saleItemsToUpdate },
      {
        withCredentials: true,
      }
    )
    return data
  },
  update: async (
    id: string,
    saleToUpdate: ISaleItemLessRelated,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${SALE_ITEM_URL}/${id}`,
      saleToUpdate,
      {
        withCredentials: true,
      }
    )
    return data
  },
}

export default saleItemService
