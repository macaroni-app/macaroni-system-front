import {z} from "zod"

const emptyStringToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value

const sanitizeStringArray = (value: unknown) => {
  if (!Array.isArray(value)) return value

  return value.filter(
    (item) => typeof item === "string" && item.trim().length > 0,
  )
}

const productItems = z.object({
  asset: z.preprocess(emptyStringToUndefined, z.string().optional()),
  baseAsset: z.preprocess(emptyStringToUndefined, z.string().optional()),
  selectionType: z.enum(["FIXED", "VARIANT_SELECTION"]).optional(),
  allowedVariantValues: z.preprocess(
    sanitizeStringArray,
    z.array(z.string()).optional(),
  ),
  quantity: z.number().nonnegative(),
  id: z.string().optional()
}).superRefine((value, context) => {
  if ((value.selectionType ?? "FIXED") === "VARIANT_SELECTION") {
    if (!value.baseAsset || value.baseAsset.length < 24) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["baseAsset"],
        message: "Seleccione una opción",
      })
    }
  } else if (!value.asset || value.asset.length < 24) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["asset"],
      message: "Seleccione una opción",
    })
  }
})

export const productSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Complete el campo"),
  costPrice: z.number().nonnegative().optional(),
  wholesalePrice: z.number({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).nonnegative(),
  retailsalePrice: z.number({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).nonnegative(),
  category: z.string({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).min(24, "Seleccione una opción").max(24),
  productType: z.string({ required_error: "Complete el campo", invalid_type_error: "Complete el campo"}).min(24, "Seleccione una opción").max(24),
  productItems: z.array(productItems),
  isDeleted: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
  createdBy: z.string().min(24).max(24).optional(),
  updatedBy: z.string().min(24).max(24).optional()
})
