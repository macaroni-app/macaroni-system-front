import {z} from "zod"

const productItems = z.object({
  asset: z.string(),
  quantity: z.number().nonnegative(),
  id: z.string().optional()
})

export const productSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Complete el campo"),
  costPrice: z.number().nonnegative().optional(),
  wholesalePrice: z.number({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).nonnegative(),
  retailsalePrice: z.number({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).nonnegative(),
  category: z.string({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).min(24, "Seleccione una opción").max(24),
  productType: z.string({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).min(24, "Seleccione una opción").max(24),
  productItems: z.array(productItems),
  isDeleted: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  createdBy: z.string().min(24).max(24).optional(),
  updatedBy: z.string().min(24).max(24).optional()
})