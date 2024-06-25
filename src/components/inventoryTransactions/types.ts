import { IAssetFullCategory } from "../assets/types"
import { IGenericObject } from "../common/types"


export enum TransactionType {
  UP = 'UP',
  DOWN = 'DOWN'
}

export enum TransactionReason {
  BUY = 'BUY',
  SELL = 'SELL',
  RETURN = 'RETURN',
  ADJUSTMENT = 'ADJUSTMENT',
  DONATION = 'DONATION',
  DEFEATED = 'DEFEATED',
  LOSS = 'LOSS',
  INTERNAL_USAGE = 'INTERNAL_USAGE'
}

export interface IInventoryTransactionFather extends IGenericObject{
  affectedAmount?: number
  transactionType?: TransactionType
  transactionReason?: TransactionReason
}

export interface IInventoryTransactionFullRelated extends IInventoryTransactionFather{
  asset?: IAssetFullCategory
}

export interface IInventoryTransactionLessRelated extends IInventoryTransactionFather{
  asset?: string
}

export interface IInventoryTransactionFullRelatedBulk extends IInventoryTransactionFather{
  inventoryTransactions: IInventoryTransactionFullRelated[]
}

export interface IInventoryTransactionLessRelatedBulk extends IInventoryTransactionFather{
  inventoryTransactions: IInventoryTransactionLessRelated[]
}
