import { ICategory } from "../categories/types"

export interface IAsset {
  _id?: string
  name?: string
  category?: ICategory
  costPrice?: number
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  createdBy?: string
  updatedBy?: string
}

export interface IAssetWithCategory {
  _id?: string
  name?: string
  category?: string
  costPrice?: number
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  createdBy?: string
  updatedBy?: string
}