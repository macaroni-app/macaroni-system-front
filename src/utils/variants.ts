import { IAssetVariant } from "../components/assetVariants/types"
import { IAssetFullCategory } from "../components/assets/types"
import {
  IProductItemFullRelated,
  IVariantSelection,
} from "../components/products/types"

export interface IAssetVariantAttributeChip {
  attributeName: string
  valueName: string
}

const getVariantValueIds = (assetVariant?: IAssetVariant | string): string[] => {
  if (!assetVariant || typeof assetVariant === "string") {
    return []
  }

  return (assetVariant.values ?? []).map((value) =>
    typeof value === "string" ? value : String(value._id),
  )
}

export const getAllowedAssetVariantsForProductItem = (
  productItem: IProductItemFullRelated,
  assetVariants: IAssetVariant[],
) => {
  const baseAssetId =
    typeof productItem.baseAsset === "string"
      ? productItem.baseAsset
      : productItem.baseAsset?._id

  const allowedValueIds = (productItem.allowedVariantValues ?? []).map((value) =>
    typeof value === "string" ? value : String(value._id),
  )

  return assetVariants.filter((assetVariant) => {
    const currentBaseAssetId =
      typeof assetVariant.baseAsset === "string"
        ? assetVariant.baseAsset
        : assetVariant.baseAsset?._id

    if (!baseAssetId || currentBaseAssetId !== baseAssetId) {
      return false
    }

    if (allowedValueIds.length === 0) {
      return true
    }

    const variantValueIds = getVariantValueIds(assetVariant)
    return variantValueIds.some((variantValueId) =>
      allowedValueIds.includes(variantValueId),
    )
  })
}

export const getVariantSelectionExpectedQuantity = (
  productItem: IProductItemFullRelated,
  lineQuantity?: number,
) => Number(productItem.quantity ?? 0) * Number(lineQuantity ?? 0)

export const getVariantSelectionCurrentQuantity = (
  variantSelections?: IVariantSelection[],
  productItemId?: string,
) =>
  (variantSelections ?? [])
    .filter((variantSelection) => {
      const currentProductItemId =
        typeof variantSelection.productItem === "string"
          ? variantSelection.productItem
          : variantSelection.productItem?._id

      return currentProductItemId === productItemId
    })
    .reduce(
      (accumulator, variantSelection) =>
        accumulator + Number(variantSelection.quantity ?? 0),
      0,
    )

export const formatVariantSelections = (
  variantSelections?: IVariantSelection[],
) =>
  (variantSelections ?? [])
    .map((variantSelection) => {
      const variantName =
        typeof variantSelection.assetVariant === "string"
          ? variantSelection.assetVariant
          : variantSelection.assetVariant?.name

      if (!variantName) {
        return null
      }

      return `${Number(variantSelection.quantity ?? 0)} ${variantName}`
    })
    .filter(Boolean)
    .join(" + ")

const getVariantValueNames = (assetVariant?: IAssetVariant | string): string[] => {
  if (!assetVariant || typeof assetVariant === "string") {
    return []
  }

  return (assetVariant.values ?? [])
    .map((value) => (typeof value === "string" ? value : value?.name))
    .filter(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    )
}

export const getAssetVariantAttributeChips = (
  assetVariant?: IAssetVariant | string,
): IAssetVariantAttributeChip[] => {
  if (!assetVariant || typeof assetVariant === "string") {
    return []
  }

  return (assetVariant.values ?? [])
    .map((value) => {
      if (typeof value === "string") {
        return undefined
      }

      const valueName = value?.name?.trim()
      const attributeName =
        typeof value?.attribute === "string"
          ? value.attribute.trim()
          : value?.attribute?.name?.trim()

      if (!valueName || !attributeName) {
        return undefined
      }

      return {
        attributeName,
        valueName,
      }
    })
    .filter(
      (chip): chip is IAssetVariantAttributeChip =>
        chip !== undefined,
    )
}

export const getAssetVariantName = (
  assetVariant?: IAssetVariant | string,
): string | undefined => {
  if (!assetVariant) {
    return undefined
  }

  if (typeof assetVariant === "string") {
    return assetVariant
  }

  if (assetVariant.name && assetVariant.name.trim().length > 0) {
    return assetVariant.name
  }

  const variantValueNames = getVariantValueNames(assetVariant)

  if (variantValueNames.length > 0) {
    return variantValueNames.join(" / ")
  }

  return undefined
}

export const getInventoryDisplayName = ({
  asset,
  assetVariant,
}: {
  asset?: IAssetFullCategory | string
  assetVariant?: IAssetVariant | string
}): string => {
  const baseName = typeof asset === "string" ? asset : asset?.name
  const variantName = getAssetVariantName(assetVariant)

  if (variantName) {
    return variantName
  }

  return baseName ?? "-"
}

export const getInventoryVariantLabel = (
  assetVariant?: IAssetVariant | string,
): string | undefined => {
  if (!assetVariant) {
    return undefined
  }

  if (typeof assetVariant !== "string") {
    const variantValueNames = getVariantValueNames(assetVariant)
    if (variantValueNames.length > 0) {
      return variantValueNames.join(" / ")
    }
  }

  return getAssetVariantName(assetVariant)
}
