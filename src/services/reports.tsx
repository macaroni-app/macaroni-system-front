import { AxiosInstance } from "axios"

const REPORT_URL = "/api/v1/reports"

interface IFilters {
  id?: string
  historyMonthToRetrieve?: number
  startDate?: string
  endDate?: string
}

const reportsService = {
  getAllSales: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.historyMonthToRetrieve) {
      finalUrl = `${REPORT_URL}/sales?historyMonthToRetrieve=${filters.historyMonthToRetrieve}`
    } else {
      finalUrl = `${REPORT_URL}/sales`
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getAllSaleItems: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.historyMonthToRetrieve) {
      finalUrl = `${REPORT_URL}/saleItems?historyMonthToRetrieve=${filters.historyMonthToRetrieve}`
    } else {
      finalUrl = `${REPORT_URL}/saleItems`
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getAllFixedCosts: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.historyMonthToRetrieve) {
      finalUrl = `${REPORT_URL}/fixedCosts?historyMonthToRetrieve=${filters.historyMonthToRetrieve}`
    } else {
      finalUrl = `${REPORT_URL}/fixedCosts  `
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getAllInventoryTransactions: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.historyMonthToRetrieve) {
      finalUrl = `${REPORT_URL}/inventoryTransactions?historyMonthToRetrieve=${filters.historyMonthToRetrieve}`
    } else {
      finalUrl = `${REPORT_URL}/inventoryTransactions  `
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  }
}

export default reportsService
