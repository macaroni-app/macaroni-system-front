import { z } from "zod"

export const variantAttributeValueSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Complete el campo"),
  attribute: z
    .string({ required_error: "Complete el campo", invalid_type_error: "Complete el campo" })
    .min(24, "Seleccione una opción")
    .max(24),
  isDeleted: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  createdBy: z.string().min(24).max(24).optional(),
  updatedBy: z.string().min(24).max(24).optional(),
})
