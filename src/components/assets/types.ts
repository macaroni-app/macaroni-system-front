import { ICategory } from "../categories/types"
import { IGenericObject } from "../common/types"

export interface IAssetFather extends IGenericObject {
  id?: string
  name?: string
  costPrice?: number
}

export interface IAssetFullCategory extends IAssetFather {
  category?: ICategory
}

export interface IAssetLessCategory extends IAssetFather {
  category?: string
}