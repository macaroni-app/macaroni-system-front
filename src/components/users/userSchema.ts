import {z} from "zod"

export const userSchema = z.object({
  _id: z.string().optional(),
  firstName: z.string().min(1, "Complete el campo"),
  lastName: z.string().min(1, "Complete el campo"),
  password: z.string().min(1, "Complete el campo").optional(),
  email: z.string().min(1, "Complete el campo").optional(),
  role: z.string().min(1, "Complete el campo").optional(),
  isDeleted: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  createdBy: z.string().min(24).max(24).optional(),
  updatedBy: z.string().min(24).max(24).optional()
})

export const userResetPasswordSchema = z.object({
  password: z.string().min(1, "Complete el campo"),
  confirmPassword: z.string().min(1, "Complete el campo")
})