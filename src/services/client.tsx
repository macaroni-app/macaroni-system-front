import { AxiosInstance } from "axios"
import { IClient } from "../components/clients/types"

const CLIENT_URL = "/api/v1/clients"

interface IFilters {
  id?: string
}

const clientService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${CLIENT_URL}?id=${filters.id}`
    } else {
      finalUrl = CLIENT_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${CLIENT_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (newClient: IClient, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(CLIENT_URL, newClient, {
      withCredentials: true,
    })
    return data
  },
  delete: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${CLIENT_URL}/${id}`, {
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
      `${CLIENT_URL}/${id}`,
      clientToUpdate,
      {
        withCredentials: true,
      }
    )
    return data
  },
  deactivate: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.put(`${CLIENT_URL}/deactivate/${id}`, {
      withCredentials: true,
    })

    return data
  },
}

export default clientService
