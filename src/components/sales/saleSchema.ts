import {z} from "zod"

export const SALE_STATUS = ['PAID', 'CANCELLED'] as const

const saleItems = z.object({
  product: z.string(),
  quantity: z.number().nonnegative(),
  // subtotal: z.number({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).nonnegative(),
  id: z.string().optional()
})

export const saleSchema = z.object({
  _id: z.string().optional(),
  client: z.string({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).min(24, "Seleccione una opción").max(24),
  paymentMethod: z.string({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).min(24, "Seleccione una opción").max(24),
  total: z.number({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).nonnegative().optional(),
  costTotal: z.number({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).nonnegative().optional(),
  saleItems: z.array(saleItems),
  status: z.enum(SALE_STATUS).optional(),
  isRetail: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  createdBy: z.string().min(24).max(24).optional(),
  updatedBy: z.string().min(24).max(24).optional()
})