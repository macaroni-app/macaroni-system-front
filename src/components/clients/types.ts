import { IGenericObject } from "../common/types"

export interface IClient extends IGenericObject{
  name?: string
  condicionIVAReceptorId?: string
  documentType?: string
  documentNumber?: number
  address?: string
}