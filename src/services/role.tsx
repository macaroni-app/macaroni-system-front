import { AxiosInstance } from "axios"
import { IRoleType } from "../components/roles/types"

const ROLE_URL = "/api/v1/roles"

interface IFilters {
  id?: string
}

const roleService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${ROLE_URL}?id=${filters.id}`
    } else {
      finalUrl = ROLE_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${ROLE_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (newRole: IRoleType, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(ROLE_URL, newRole, {
      withCredentials: true,
    })
    return data
  },
  delete: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${ROLE_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  update: async (
    id: string,
    roleToUpdate: IRoleType,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(`${ROLE_URL}/${id}`, roleToUpdate, {
      withCredentials: true,
    })
    return data
  },
}

export default roleService
