import { AxiosInstance } from "axios"
import { ICategory } from "../components/categories/types"

const CATEGORY_URL = "/api/v1/categories"

interface IFilters {
  id?: string
}

const categoryService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${CATEGORY_URL}?id=${filters.id}`
    } else {
      finalUrl = CATEGORY_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${CATEGORY_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (newCategory: ICategory, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(CATEGORY_URL, newCategory, {
      withCredentials: true,
    })
    return data
  },
  delete: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${CATEGORY_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  update: async (
    id: string,
    categoryToUpdate: ICategory,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${CATEGORY_URL}/${id}`,
      categoryToUpdate,
      {
        withCredentials: true,
      }
    )
    return data
  },
}

export default categoryService
