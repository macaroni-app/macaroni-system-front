import {z} from "zod"

export const productTypeSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Complete el campo"),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  createdBy: z.string().min(24).max(24).optional(),
  updatedBy: z.string().min(24).max(24).optional()
})