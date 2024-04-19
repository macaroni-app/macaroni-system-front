import {z} from "zod"

export const paymentMethodSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Complete el campo"),
  isDeleted: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  createdBy: z.string().min(24).max(24).optional(),
  updatedBy: z.string().min(24).max(24).optional()
})