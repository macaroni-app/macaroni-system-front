import { IBusiness } from "../businesses/types"
import { IClient } from "../clients/types"
import { IGenericObject } from "../common/types"
import { IInventoryFullRelated } from "../inventories/types"
import { IPaymentMethod } from "../paymentMethods/types"
import { IProductFullRelated } from "../products/types"
import { ISaleFullRelated } from "../sales/types"

export enum OrderRequestStatus {
  DRAFT = "DRAFT",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  CONVERTED = "CONVERTED",
}

export enum OrderRequestPaymentStatus {
  UNPAID = "UNPAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  PAID = "PAID",
}

export interface IOrderRequestPayment extends IGenericObject {
  amount?: number
  paymentMethod?: IPaymentMethod | string
  note?: string
  createdAt?: Date | string
  createdBy?: {
    firstName?: string
    lastName?: string
  }
}

export interface IReservedOrderInventoryItem {
  inventory?: string | IInventoryFullRelated
  asset?: string
  quantity?: number
}

export interface IOrderRequestFather extends IGenericObject {
  orderCode?: string
  isRetail?: boolean
  total?: number
  discount?: number
  payments?: IOrderRequestPayment[]
  paidAmount?: number
  pendingAmount?: number
  paymentStatus?: OrderRequestPaymentStatus
  status?: OrderRequestStatus
  confirmedAt?: Date | string
  cancelledAt?: Date | string
  convertedAt?: Date | string
  reservedItems?: IReservedOrderInventoryItem[]
  items?: IOrderRequestItemFullRelated[]
}

export interface IOrderRequestFullRelated extends IOrderRequestFather {
  client?: IClient
  business?: IBusiness
  convertedSale?: ISaleFullRelated | string
}

export interface IOrderRequestLessRelated extends IOrderRequestFather {
  client?: string
  business?: string
  convertedSale?: string
  items?: IOrderRequestItemLessRelated[]
  initialPaymentAmount?: number
  initialPaymentMethod?: string
  initialPaymentNote?: string
}

export interface IOrderRequestItemFather extends IGenericObject {
  quantity?: number
  unitPrice?: number
  subtotal?: number
}

export interface IOrderRequestItemFullRelated extends IOrderRequestItemFather {
  orderRequest?: IOrderRequestFullRelated | string
  product?: IProductFullRelated
}

export interface IOrderRequestItemLessRelated extends IOrderRequestItemFather {
  orderRequest?: string
  product?: string
}

export interface IConvertOrderRequestPayload {
  business?: string
  paymentMethod: string
  discount?: number
}

export interface IAddOrderRequestPaymentPayload {
  amount: number
  paymentMethod: string
  note?: string
}

export interface IConvertOrderRequestModalValues {
  paymentMethod: string
}

export type IOrderRequestItemPreview = Pick<IOrderRequestItemLessRelated, "product" | "quantity" | "id">
export type IOrderRequestFormItem = Pick<IOrderRequestItemLessRelated, "product" | "quantity" | "id">
export type IOrderRequestWithActions = IOrderRequestFullRelated & {
  items?: IOrderRequestItemFullRelated[]
}
export type IOrderRequestPaymentMethod = IPaymentMethod
