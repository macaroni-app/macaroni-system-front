import { AxiosInstance } from "axios"
import { ISaleLessRelated } from "../components/sales/types"

const SALE_URL = "/api/v1/sales"

interface IFilters {
  id?: string
  historyMonthToRetrieve?: number
}

const saleService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${SALE_URL}?id=${filters.id}`
    } else {
      finalUrl = SALE_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getAllForReport: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.historyMonthToRetrieve) {
      finalUrl = `${SALE_URL}?historyMonthToRetrieve=${filters.historyMonthToRetrieve}`
    } else {
      finalUrl = SALE_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${SALE_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (newSale: ISaleLessRelated, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(SALE_URL, newSale, {
      withCredentials: true,
    })
    return data
  },
  delete: async (id: string | undefined, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${SALE_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  update: async (
    id: string,
    saleToUpdate: ISaleLessRelated,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(`${SALE_URL}/${id}`, saleToUpdate, {
      withCredentials: true,
    })
    return data
  },
}

export default saleService
