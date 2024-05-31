import { IGenericObject } from "../common/types"

export interface IFixedCost extends IGenericObject{
  name?: string
  amount?: number
  operationDate?: Date
}