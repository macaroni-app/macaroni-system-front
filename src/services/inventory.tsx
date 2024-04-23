import { AxiosInstance } from "axios"
import { IInventoryLessRelated } from "../components/inventories/types"

const INVENTORY_URL = "/api/v1/inventories"

interface IFilters {
  id?: string
}

const inventoryService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${INVENTORY_URL}?id=${filters.id}`
    } else {
      finalUrl = INVENTORY_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${INVENTORY_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (
    newInventory: IInventoryLessRelated,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.post(INVENTORY_URL, newInventory, {
      withCredentials: true,
    })
    return data
  },
  delete: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${INVENTORY_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  update: async (
    id: string,
    inventoryToUpdate: IInventoryLessRelated,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${INVENTORY_URL}/${id}`,
      inventoryToUpdate,
      {
        withCredentials: true,
      }
    )
    return data
  },
  updateMany: async (
    inventoriesToUpdate: IInventoryLessRelated[],
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      INVENTORY_URL + "/bulkUpdate",
      { inventories: inventoriesToUpdate },
      {
        withCredentials: true,
      }
    )
    return data
  },
}

export default inventoryService
