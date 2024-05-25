import {z} from "zod"

export const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Complete el campo"),
  code: z.number()
})