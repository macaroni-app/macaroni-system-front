import { IGenericObject } from "../common/types"

export interface IBusiness extends IGenericObject {
  id?: string
  name?: string
  cuit?: string
  address?: string
  ivaCondition?: string
}
