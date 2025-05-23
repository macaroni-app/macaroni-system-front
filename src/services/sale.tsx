import { AxiosInstance } from "axios"
import { ISaleLessRelated } from "../components/sales/types"

const SALE_URL = "/api/v1/sales"

interface IFilters {
  id?: string
  startDate?: string
  endDate?: string
}

const saleService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (!filters.id && filters.startDate && filters.endDate) {
      finalUrl = `${SALE_URL}?startDate=${filters.startDate}&endDate=${filters.endDate}`
    } else if (filters.id) {
      finalUrl = `${SALE_URL}?id=${filters.id}`
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

    if (saleToUpdate.isBilled === undefined || saleToUpdate.isBilled === null) {
      const { data } = await axiosPrivate.put(`${SALE_URL}/cancelledSale?id=${id}`, saleToUpdate, {
        withCredentials: true,
      })
      return data
    }

    if (saleToUpdate.isBilled !== undefined || saleToUpdate.isBilled !== null) {
      const { data } = await axiosPrivate.put(`${SALE_URL}/setBilledSale?id=${id}`, saleToUpdate, {
        withCredentials: true,
      })
      return data
    }
  },
}

export default saleService
