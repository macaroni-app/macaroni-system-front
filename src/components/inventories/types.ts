import { IAssetFullCategory } from "../assets/types"
import { IGenericObject } from "../common/types"

export interface IInventoryFather extends IGenericObject{
  quantityAvailable?: number
}

export interface IInventoryFullRelated extends IInventoryFather{
  asset?: IAssetFullCategory
}

export interface IInventoryLessRelated extends IInventoryFather{
  asset?: string
}