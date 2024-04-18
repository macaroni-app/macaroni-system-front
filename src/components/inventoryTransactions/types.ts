import { IAssetFullCategory } from "../assets/types"
import { IGenericObject } from "../common/types"


export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface IInventoryTransactionFather extends IGenericObject{
  affectedAmount?: number
  transactionType?: TransactionType
}

export interface IInventoryTransactionFullRelated extends IInventoryTransactionFather{
  asset?: IAssetFullCategory
}

export interface IInventoryTransactionLessRelated extends IInventoryTransactionFather{
  asset?: string
}
