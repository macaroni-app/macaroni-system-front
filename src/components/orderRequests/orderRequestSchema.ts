import { z } from "zod"

export const ORDER_REQUEST_STATUS = [
  "DRAFT",
  "CONFIRMED",
  "CANCELLED",
  "CONVERTED",
] as const

const orderRequestItems = z.object({
  product: z
    .string({ required_error: "Complete el campo", invalid_type_error: "Complete el campo" })
    .min(24, "Seleccione una opción")
    .max(24),
  quantity: z
    .number({ required_error: "Complete el campo", invalid_type_error: "Complete el campo" })
    .positive("La cantidad debe ser mayor a 0"),
  id: z.string().optional(),
})

export const orderRequestSchema = z.object({
  _id: z.string().optional(),
  client: z
    .string({ required_error: "Complete el campo", invalid_type_error: "Complete el campo" })
    .min(24, "Seleccione una opción")
    .max(24),
  total: z.number().nonnegative().optional(),
  discount: z.number().nonnegative().optional(),
  initialPaymentAmount: z.number().nonnegative().optional(),
  initialPaymentMethod: z.string().optional(),
  initialPaymentNote: z.string().optional(),
  items: z.array(orderRequestItems).min(1, "Agregá al menos un producto"),
  status: z.enum(ORDER_REQUEST_STATUS).optional(),
  isRetail: z.boolean().optional(),
  business: z.string().optional(),
  isDeleted: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  createdBy: z.string().min(24).max(24).optional(),
  updatedBy: z.string().min(24).max(24).optional(),
})
