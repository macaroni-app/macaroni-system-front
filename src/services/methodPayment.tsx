import { AxiosInstance } from "axios"
import { IPaymentMethod } from "../components/paymentMethods/types"

const PAYMENT_METHOD_URL = "/api/v1/methodPayments"

interface IFilters {
  id?: string
}

const paymentMethodService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${PAYMENT_METHOD_URL}?id=${filters.id}`
    } else {
      finalUrl = PAYMENT_METHOD_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${PAYMENT_METHOD_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (
    newPaymentMethod: IPaymentMethod,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.post(
      PAYMENT_METHOD_URL,
      newPaymentMethod,
      {
        withCredentials: true,
      }
    )
    return data
  },
  delete: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${PAYMENT_METHOD_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  update: async (
    id: string,
    paymentMethodToUpdate: IPaymentMethod,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${PAYMENT_METHOD_URL}/${id}`,
      paymentMethodToUpdate,
      {
        withCredentials: true,
      }
    )
    return data
  },
}

export default paymentMethodService
