import { IGenericObject } from "../common/types"
import { IRoleType } from "../roles/types"

export interface IUserFather extends IGenericObject{
  _id?: string
  firstName?: string
  lastName?: string
  password?: string
  email?: string
}

export interface IUserFullRelated extends IUserFather {
  role?: IRoleType
}

export interface IUserLessRelated extends IUserFather {
  role?: string
  confirmPassword?: string
}