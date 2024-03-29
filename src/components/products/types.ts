export interface IProduct {
  _id: string
  name: string
  costPrice: Number
  wholesalePrice: Number
  retailsalePrice: Number
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
  createdBy: string
  updatedBy: string
}