import { AxiosInstance } from "axios"

import { IUser } from "../components/users/types"

const USER_URL = "/api/v1/users"

interface IFilters {
  id?: string
}

const userService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${USER_URL}?id=${filters.id}`
    } else {
      finalUrl = USER_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${USER_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (newUser: IUser, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(`${USER_URL}/register`, newUser, {
      withCredentials: true,
    })
    return data
  },
  delete: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${USER_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  update: async (
    id: string,
    userToUpdate: IUser,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(`${USER_URL}/${id}`, userToUpdate, {
      withCredentials: true,
    })
    return data
  },
  changeIsActive: async (
    id: string,
    isActive: boolean,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${USER_URL}/soft-delete/${id}`,
      { isActive },
      {
        withCredentials: true,
      }
    )

    return data
  },
}

export default userService
