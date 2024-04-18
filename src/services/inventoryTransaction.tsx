import { AxiosInstance } from "axios"
import { IInventoryTransactionLessRelated } from "../components/inventoryTransactions/types"

const INVENTORY_TRANSACTION_URL = "/api/v1/inventoryTransactions"

interface IFilters {
  id?: string
}

const inventoryTransactionService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${INVENTORY_TRANSACTION_URL}?id=${filters.id}`
    } else {
      finalUrl = INVENTORY_TRANSACTION_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(
      `${INVENTORY_TRANSACTION_URL}/${id}`,
      {
        withCredentials: true,
      }
    )
    return data
  },
  store: async (
    newInventory: IInventoryTransactionLessRelated,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.post(
      INVENTORY_TRANSACTION_URL,
      newInventory,
      {
        withCredentials: true,
      }
    )
    return data
  },
  delete: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(
      `${INVENTORY_TRANSACTION_URL}/${id}`,
      {
        withCredentials: true,
      }
    )
    return data
  },
  update: async (
    id: string,
    inventoryToUpdate: IInventoryTransactionLessRelated,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${INVENTORY_TRANSACTION_URL}/${id}`,
      inventoryToUpdate,
      {
        withCredentials: true,
      }
    )
    return data
  },
}

export default inventoryTransactionService
