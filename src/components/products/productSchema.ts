import {z} from "zod"

export const productSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Complete el campo"),
  costPrice: z.number({
    required_error: "Precio de costo requerido",
    invalid_type_error: "Precio de costo debe ser un número",
  }).nonnegative({message: "No puede ser negativo"}),
  wholesalePrice: z.number({
    required_error: "Precio por mayor requerido",
    invalid_type_error: "Precio por mayor debe ser un número",
  }).nonnegative({message: "No puede ser negativo"}),
  retailsalePrice: z.number({
    required_error: "Precio por menor requerido",
    invalid_type_error: "Precio por menor debe ser un número",
  }).nonnegative({message: "No puede ser negativo"}),
  isDeleted: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  createdBy: z.string().min(24).max(24).optional(),
  updatedBy: z.string().min(24).max(24).optional()
})

  