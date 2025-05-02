import { AxiosInstance } from "axios"
import { IInvoice } from "../components/afip/types"

const AFIP_URL = "/api/v1/afip"

interface IFilters {
  id?: string
}

const invoiceService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${AFIP_URL}?id=${filters.id}`
    } else {
      finalUrl = AFIP_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (saleId: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${AFIP_URL}/invoices?saleId=${saleId}`, {
      withCredentials: true,
    })
    return data
  },
  generateInvoice: async (newInvoice: IInvoice, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(`${AFIP_URL}/generate-invoice`, newInvoice, {
      withCredentials: true,
    })
    return data
  },
  getDocumentTypes: async (axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${AFIP_URL}/document-types`, {
      withCredentials: true,
    })
    return data
  },
  getCondicionIvaReceptor: async (axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${AFIP_URL}/conditions-iva-receptor`, {
      withCredentials: true,
    })
    return data
  }
}

export default invoiceService
