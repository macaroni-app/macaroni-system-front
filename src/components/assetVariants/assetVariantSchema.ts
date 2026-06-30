import { z } from "zod"

const emptyNumberToUndefined = (value: unknown) => {
  if (
    value === "" ||
    value === null ||
    value === undefined ||
    (typeof value === "number" && Number.isNaN(value))
  ) {
    return undefined
  }

  return value
}

export const assetVariantSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Complete el campo"),
  baseAsset: z
    .string({ required_error: "Complete el campo", invalid_type_error: "Complete el campo" })
    .min(24, "Seleccione una opción")
    .max(24),
  values: z.array(z.string()).optional(),
  sku: z.string().optional(),
  costPrice: z.preprocess(
    emptyNumberToUndefined,
    z.number().nonnegative().optional(),
  ),
  isDeleted: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  createdBy: z.string().min(24).max(24).optional(),
  updatedBy: z.string().min(24).max(24).optional(),
})
