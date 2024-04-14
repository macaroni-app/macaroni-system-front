import { ICategory } from "../categories/types"

export interface IAssetFather {
  _id?: string
  name?: string
  costPrice?: number
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  createdBy?: string
  updatedBy?: string
}

export interface IAssetFullCategory extends IAssetFather {
  category?: ICategory
}

export interface IAssetLessCategory extends IAssetFather {
  category?: string
}