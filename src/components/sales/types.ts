import { IClient } from "../clients/types"
import { IGenericObject } from "../common/types"
import { IPaymentMethod } from "../paymentMethods/types"
import { IProductFullRelated } from "../products/types"

export enum SaleStatus {
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export interface ISaleFather extends IGenericObject {
  isRetail?: boolean
  total?: number
  status?: SaleStatus
  saleItems?: ISaleItemPreview[]
}
export interface ISaleFullRelated extends ISaleFather{
  client?: IClient
  paymentMethod?: IPaymentMethod
}

export interface ISaleLessRelated extends ISaleFather {
  client?: string
  paymentMethod?: string
}

export interface ISaleItemFather extends IGenericObject {
  quantity?: number
  subtotal?: number
}

export interface ISaleItemFullRelated extends ISaleItemFather {
  sale?: ISaleFullRelated
  product?: IProductFullRelated
}

export interface ISaleItemLessRelated extends ISaleItemFather {
  sale?: string
  product?: string
}

export type ISaleItemPreview = Pick<ISaleItemLessRelated, "product" | "quantity" | "id">
export type ISaleItemOmitSale = Pick<ISaleItemFullRelated, "product" | "quantity">
