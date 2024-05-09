export interface IFilters {
  filters: {
    id?: string
  }
}

interface ICreatedBy {
  id: string
  firstName: string
  lastName: string
}

export interface IGenericObject {
  id?: string
  _id?: string
  isDeleted?: boolean
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  createdBy?: ICreatedBy
  updatedBy?: string
}