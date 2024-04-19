import { IAssetFullCategory } from "../assets/types"
import { ICategory } from "../categories/types"
import { IGenericObject } from "../common/types"
import { IProductTypeType } from "../productTypes/types"

export interface ISaleFather extends IGenericObject {
  isRetail?: boolean
  client: string
  paymentMethod: string
  total: number
  // productItems?: IProductItemPreview[]
}
export interface ISaleFullRelated extends ISaleFather{
  
}
// export interface IProductFullRelated extends IProductFather {
//   productType?: IProductTypeType
//   category?: ICategory
// }

// export interface IProductLessRelated extends IProductFather {
//   productType?: string
//   category?: string
// }

// export interface IProductItemFather extends IGenericObject {
//   quantity?: Number
// }

// export interface IProductItemFullRelated extends IProductItemFather {
//   asset?: IAssetFullCategory
//   product?: IProductFullRelated
//   quantity?: Number
// }

// export interface IProductItemLessRelated extends IProductItemFather {
//   asset?: string
//   product?: string
//   quantity?: Number
// }

// export type IProductItemPreview = Pick<IProductItemLessRelated, "asset" | "quantity" | "id">;
// export type IProductItemOmitProduct = Pick<IProductItemFullRelated, "asset" | "quantity">;
