import { IAssetFullCategory } from "../assets/types"
import { IGenericObject } from "../common/types"


export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  RETURN = 'RETURN',
  ADJUSTMENT_UP = 'ADJUSTMENT_UP',
  ADJUSTMENT_DOWN = 'ADJUSTMENT_DOWN'
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
