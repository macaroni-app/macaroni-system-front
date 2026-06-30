import { IGenericObject } from "../common/types"
import { IVariantAttribute } from "../variantAttributes/types"

export interface IVariantAttributeValue extends IGenericObject {
  name?: string
  attribute?: IVariantAttribute | string
}
