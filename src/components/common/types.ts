export interface IFilters {
  filters: {
    id?: string
  }
}

export interface IGenericObject {
  id?: string
  _id?: string
  isDeleted?: boolean
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  createdBy?: string
  updatedBy?: string
}