import { AxiosInstance } from "axios"
import { IOrderRequestItemLessRelated } from "../components/orderRequests/types"

const ORDER_REQUEST_ITEM_URL = "/api/v1/orderRequestItems"

interface IFilters {
  id?: string
  all?: boolean
}

const orderRequestItemService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${ORDER_REQUEST_ITEM_URL}?id=${filters.id}`
    } else if (filters.all) {
      finalUrl = `${ORDER_REQUEST_ITEM_URL}?all=true`
    } else {
      finalUrl = ORDER_REQUEST_ITEM_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${ORDER_REQUEST_ITEM_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (newOrderRequestItem: IOrderRequestItemLessRelated, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(ORDER_REQUEST_ITEM_URL, newOrderRequestItem, {
      withCredentials: true,
    })
    return data
  },
  storeMany: async (newOrderRequestItems: IOrderRequestItemLessRelated[], axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(
      `${ORDER_REQUEST_ITEM_URL}/bulkCreate`,
      { orderRequestItems: newOrderRequestItems },
      {
        withCredentials: true,
      }
    )
    return data
  },
  update: async (id: string, orderRequestItemToUpdate: IOrderRequestItemLessRelated, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.put(`${ORDER_REQUEST_ITEM_URL}/${id}`, orderRequestItemToUpdate, {
      withCredentials: true,
    })
    return data
  },
  delete: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${ORDER_REQUEST_ITEM_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  deleteMany: async (orderRequestItemsToDelete: IOrderRequestItemLessRelated[], axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.put(
      `${ORDER_REQUEST_ITEM_URL}/bulkDelete`,
      { orderRequestItems: orderRequestItemsToDelete },
      {
        withCredentials: true,
      }
    )
    return data
  },
}

export default orderRequestItemService
