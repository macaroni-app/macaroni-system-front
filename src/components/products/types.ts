import { ICategory } from "../categories/types"
import { IProductTypeType } from "../productTypes/types"

export interface IProduct {
  _id?: string
  name?: string
  costPrice?: Number
  wholesalePrice?: Number
  retailsalePrice?: Number
  productType?: string
  category?: string
  isDeleted?: boolean
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  createdBy?: string
  updatedBy?: string
}

export interface IProductComplete {
  _id?: string
  name?: string
  costPrice?: Number
  wholesalePrice?: Number
  retailsalePrice?: Number
  productType?: IProductTypeType
  category?: ICategory
  productItems?: {asset: string, quantity: number}[]
  isDeleted?: boolean
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  createdBy?: string
  updatedBy?: string
}

export interface IProductItem {
  asset?: string
  product?: string
  quantity?: Number
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  createdBy?: string
  updatedBy?: string
}