import { IAssetFullCategory } from "../assets/types"
import { IAssetVariant } from "../assetVariants/types"
import { IGenericObject } from "../common/types"

export interface IInventoryFather extends IGenericObject{
  quantityAvailable?: number
  quantityReserved?: number
}

export interface IInventoryFullRelated extends IInventoryFather{
  asset?: IAssetFullCategory
  assetVariant?: IAssetVariant
}

export interface IInventoryLessRelated extends IInventoryFather{
  asset?: string
  assetVariant?: string
}
