import { AxiosInstance } from "axios"

const PRODUCT_URL = "/api/v1/products"

interface IProduct {
  name: string
  costPrice: Number
  wholesalePrice: Number
  retailsalePrice: Number
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
  createdBy: string
  updatedBy: string
}

interface IFilters {
  id?: string
}

const productService = {
  getAll: async (filters: IFilters, axiosPrivate: AxiosInstance) => {
    let finalUrl

    if (filters.id) {
      finalUrl = `${PRODUCT_URL}?id=${filters.id}`
    } else {
      finalUrl = PRODUCT_URL
    }

    const { data } = await axiosPrivate.get(finalUrl, {
      withCredentials: true,
    })
    return data
  },
  getOne: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.get(`${PRODUCT_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  store: async (newProduct: IProduct, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.post(PRODUCT_URL, newProduct, {
      withCredentials: true,
    })
    return data
  },
  delete: async (id: string, axiosPrivate: AxiosInstance) => {
    const { data } = await axiosPrivate.delete(`${PRODUCT_URL}/${id}`, {
      withCredentials: true,
    })
    return data
  },
  update: async (
    id: string,
    productToUpdate: IProduct,
    axiosPrivate: AxiosInstance
  ) => {
    const { data } = await axiosPrivate.put(
      `${PRODUCT_URL}/${id}`,
      productToUpdate,
      {
        withCredentials: true,
      }
    )
    return data
  },
  // updateMany: async (products, axiosPrivate) => {
  //   const { data } = await axiosPrivate.put(`${PRODUCT_URL}`, products, {
  //     withCredentials: true,
  //   })
  //   return data
  // },
}

export default productService
