import { AxiosInstance } from "axios"
import { IClient } from "../components/clients/types"

const BUSINESS_URL = "/api/v1/businesses"

interface IFilters {
  id?: string
}

const businessService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${BUSINESS_URL}?id=${filters.id}`
    } else {
      finalUrl = BUSINESS_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${BUSINESS_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (newClient: IClient, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(BUSINESS_URL, newClient, {
      withCredentials: true,
    })
    return data
  },
  delete: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${BUSINESS_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  update: async (
    id: string,
    clientToUpdate: IClient,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${BUSINESS_URL}/${id}`,
      clientToUpdate,
      {
        withCredentials: true,
      }
    )
    return data
  },
  changeIsActive: async (
    id: string,
    isActive: boolean,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${BUSINESS_URL}/soft-delete/${id}`,
      { isActive },
      {
        withCredentials: true,
      }
    )

    return data
  },
}

export default businessService
