import { IAssetFullCategory } from "../assets/types"
import { IAssetVariant } from "../assetVariants/types"
import { ICategory } from "../categories/types"
import { IGenericObject } from "../common/types"
import { IProductTypeType } from "../productTypes/types"
import { IVariantAttributeValue } from "../variantAttributeValues/types"

export enum ProductItemSelectionType {
  FIXED = "FIXED",
  VARIANT_SELECTION = "VARIANT_SELECTION",
}

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

export interface IProductBulkPriceUpdate {
  id: string
  wholesalePrice: number
  retailsalePrice: number
}

export interface IProductItemFather extends IGenericObject {
  quantity?: Number
  selectionType?: ProductItemSelectionType
  baseAsset?: IAssetFullCategory | string
  allowedVariantValues?: IVariantAttributeValue[] | string[]
}

export interface IProductItemFullRelated extends IProductItemFather {
  asset?: IAssetFullCategory
  product?: IProductFullRelated
}

export interface IProductItemLessRelated extends IProductItemFather {
  asset?: string
  product?: string
  baseAsset?: string
  allowedVariantValues?: string[]
}

export type IProductItemPreview = Pick<IProductItemLessRelated, "asset" | "baseAsset" | "selectionType" | "allowedVariantValues" | "quantity" | "id">;
export type IProductItemOmitProduct = Pick<IProductItemFullRelated, "asset" | "quantity">;

export interface IVariantSelection extends IGenericObject {
  productItem?: IProductItemFullRelated | string
  assetVariant?: IAssetVariant | string
  quantity?: number
}
