import {z} from "zod"

export const SALE_STATUS = ['PAID', 'CANCELLED'] as const

const emptyStringToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value

const sanitizeVariantSelections = (value: unknown) => {
  if (!Array.isArray(value)) return value

  return value.filter((selection) => {
    if (!selection || typeof selection !== "object") return false

    const currentSelection = selection as {
      productItem?: unknown
      assetVariant?: unknown
      quantity?: unknown
    }

    const hasProductItem =
      typeof currentSelection.productItem === "string" &&
      currentSelection.productItem.trim().length > 0
    const hasAssetVariant =
      typeof currentSelection.assetVariant === "string" &&
      currentSelection.assetVariant.trim().length > 0
    const hasQuantity = Number(currentSelection.quantity ?? 0) > 0

    return hasProductItem || hasAssetVariant || hasQuantity
  })
}

const variantSelectionSchema = z.object({
  productItem: z.preprocess(
    emptyStringToUndefined,
    z.string().min(24, "Seleccione una opción").max(24),
  ),
  assetVariant: z.preprocess(
    emptyStringToUndefined,
    z.string().min(24, "Seleccione una opción").max(24),
  ),
  quantity: z.number().positive("La cantidad debe ser mayor a 0"),
})

const saleItems = z.object({
  product: z.string(),
  quantity: z.number().nonnegative(),
  variantSelections: z.preprocess(
    sanitizeVariantSelections,
    z.array(variantSelectionSchema).optional(),
  ),
  // subtotal: z.number({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).nonnegative(),
  id: z.string().optional()
})

export const saleSchema = z.object({
  _id: z.string().optional(),
  client: z.string({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).min(24, "Seleccione una opción").max(24),
  paymentMethod: z.string({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).min(24, "Seleccione una opción").max(24),
  total: z.number({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).nonnegative().optional(),
  costTotal: z.number({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).nonnegative().optional(),
  discount: z.number().nonnegative().optional(),
  saleItems: z.array(saleItems),
  status: z.enum(SALE_STATUS).optional(),
  isRetail: z.boolean().optional(),
  isBilled: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  createdBy: z.string().min(24).max(24).optional(),
  updatedBy: z.string().min(24).max(24).optional()
})
