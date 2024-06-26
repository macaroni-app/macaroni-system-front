import { IAssetFullCategory } from "../assets/types"
import { ICategory } from "../categories/types"
import { IGenericObject } from "../common/types"
import { IProductTypeType } from "../productTypes/types"

export interface IProductFather extends IGenericObject {
  name?: string
  costPrice?: Number
  wholesalePrice?: Number
  retailsalePrice?: Number
  productItems?: IProductItemPreview[]
}

export interface IProductFullRelated extends IProductFather {
  productType?: IProductTypeType
  category?: ICategory
}

export interface IProductLessRelated extends IProductFather {
  productType?: string
  category?: string
}

export interface IProductItemFather extends IGenericObject {
  quantity?: Number
}

export interface IProductItemFullRelated extends IProductItemFather {
  asset?: IAssetFullCategory
  product?: IProductFullRelated
}

export interface IProductItemLessRelated extends IProductItemFather {
  asset?: string
  product?: string
}

export type IProductItemPreview = Pick<IProductItemLessRelated, "asset" | "quantity" | "id">;
export type IProductItemOmitProduct = Pick<IProductItemFullRelated, "asset" | "quantity">;
