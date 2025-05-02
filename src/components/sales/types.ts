import { IBusiness } from "../businesses/types"
import { IClient } from "../clients/types"
import { IGenericObject } from "../common/types"
import { IPaymentMethod } from "../paymentMethods/types"
import { IProductFullRelated } from "../products/types"

export enum SaleStatus {
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export enum CONCEPT_TYPE_AFIP {
  PRODUCTOS = 1,
  SERVICIOS = 2,
  PRODUCTOS_Y_SERVICIOS = 3
}

export enum INVOICE_TYPE_AFIP {
  FACTURA_C = 11
}

export enum POINT_OF_SALE_AFIP {
  ONE = 1,
  TWELVE = 12
}

export interface ISaleFather extends IGenericObject {
  isRetail?: boolean
  isBilled?: boolean
  total?: number
  costTotal?: number
  discount?: number
  status?: SaleStatus
  saleItems?: ISaleItemPreview[]
}
export interface ISaleFullRelated extends ISaleFather{
  client?: IClient
  business?: IBusiness
  paymentMethod?: IPaymentMethod
}

export interface ISaleLessRelated extends ISaleFather {
  client?: string
  business?: string
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
