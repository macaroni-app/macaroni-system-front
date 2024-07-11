import { AxiosInstance } from "axios"
import { IFixedCost } from "../components/fixedCosts/types"

const FIXED_COSTS_URL = "/api/v1/fixedCosts"

interface IFilters {
  id?: string
  startDate?: string
  endDate?: string
}

const fixedCostService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (!filters.id && filters.startDate && filters.endDate) {
      finalUrl = `${FIXED_COSTS_URL}?startDate=${filters.startDate}&endDate=${filters.endDate}`
    } else if (filters.id) {
      finalUrl = `${FIXED_COSTS_URL}?id=${filters.id}`
    } else {
      finalUrl = FIXED_COSTS_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${FIXED_COSTS_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (newFixedCost: IFixedCost, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(FIXED_COSTS_URL, newFixedCost, {
      withCredentials: true,
    })
    return data
  },
  delete: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${FIXED_COSTS_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  update: async (
    id: string,
    fixedCostToUpdate: IFixedCost,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${FIXED_COSTS_URL}/${id}`,
      fixedCostToUpdate,
      {
        withCredentials: true,
      }
    )
    return data
  },
}

export default fixedCostService
