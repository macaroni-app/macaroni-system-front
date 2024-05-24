import { IGenericObject } from "../common/types"

export interface IUser extends IGenericObject{
  firstName?: string
  lastName?: string
  password?: string
  roles?: number[]
  email?: string
}

export interface IRole {
  _id?: string
  name?: string
  code?: number
}