import { AxiosInstance } from "axios"
import { IAddOrderRequestPaymentPayload, IConvertOrderRequestPayload, IOrderRequestLessRelated } from "../components/orderRequests/types"

const ORDER_REQUEST_URL = "/api/v1/orderRequests"

interface IFilters {
  id?: string
  orderCode?: string
  clientName?: string
  startDate?: string
  endDate?: string
  activeOnly?: boolean
}

const orderRequestService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.orderCode) {
      finalUrl = `${ORDER_REQUEST_URL}?orderCode=${encodeURIComponent(filters.orderCode)}`
    } else if (filters.clientName) {
      finalUrl = `${ORDER_REQUEST_URL}?clientName=${encodeURIComponent(filters.clientName)}`
    } else if (filters.activeOnly) {
      finalUrl = `${ORDER_REQUEST_URL}?activeOnly=true`
    } else if (!filters.id && filters.startDate && filters.endDate) {
      finalUrl = `${ORDER_REQUEST_URL}?startDate=${filters.startDate}&endDate=${filters.endDate}`
    } else if (filters.id) {
      finalUrl = `${ORDER_REQUEST_URL}?id=${filters.id}`
    } else {
      finalUrl = ORDER_REQUEST_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${ORDER_REQUEST_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (newOrderRequest: IOrderRequestLessRelated, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(ORDER_REQUEST_URL, newOrderRequest, {
      withCredentials: true,
    })
    return data
  },
  update: async (id: string, orderRequestToUpdate: IOrderRequestLessRelated, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.put(`${ORDER_REQUEST_URL}/${id}`, orderRequestToUpdate, {
      withCredentials: true,
    })
    return data
  },
  confirm: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(`${ORDER_REQUEST_URL}/${id}/confirm`, {}, {
      withCredentials: true,
    })
    return data
  },
  cancel: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(`${ORDER_REQUEST_URL}/${id}/cancel`, {}, {
      withCredentials: true,
    })
    return data
  },
  addPayment: async (id: string, payload: IAddOrderRequestPaymentPayload, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(`${ORDER_REQUEST_URL}/${id}/payments`, payload, {
      withCredentials: true,
    })
    return data
  },
  convertToSale: async (id: string, payload: IConvertOrderRequestPayload, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(`${ORDER_REQUEST_URL}/${id}/convertToSale`, payload, {
      withCredentials: true,
    })
    return data
  },
}

export default orderRequestService
