import { IGenericObject } from "../common/types"

export interface IUser extends IGenericObject{
  firstName?: string
  lastName?: string
  password?: string
  roles?: number[]
  email?: string
}