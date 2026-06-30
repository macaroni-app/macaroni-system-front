import { IAssetFullCategory } from "../assets/types"
import { IGenericObject } from "../common/types"
import { IVariantAttributeValue } from "../variantAttributeValues/types"

export interface IAssetVariant extends IGenericObject {
  name?: string
  baseAsset?: IAssetFullCategory | string
  values?: IVariantAttributeValue[] | string[]
  sku?: string
  costPrice?: number
}
