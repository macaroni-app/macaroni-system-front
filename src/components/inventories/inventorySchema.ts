import {z} from "zod"

export const inventorySchema = z.object({
  _id: z.string().optional(),
  asset: z.string({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).min(24, "Seleccione una opción").max(24),
  quantityAvailable: z.number().nonnegative(),
  isDeleted: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  createdBy: z.string().min(24).max(24).optional(),
  updatedBy: z.string().min(24).max(24).optional()
})