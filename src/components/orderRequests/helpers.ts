import { AxiosError } from "axios"
import { IAssetVariant } from "../assetVariants/types"
import { IInventoryFullRelated } from "../inventories/types"
import { IProductFullRelated } from "../products/types"
import {
  IAddOrderRequestPaymentPayload,
  IOrderRequestFormItem,
  IOrderRequestItemLessRelated,
  IOrderRequestPayment,
  IReservedOrderInventoryItem,
  OrderRequestPaymentStatus,
  OrderRequestStatus,
} from "./types"

type ApiErrorResponse = {
  message?: string
  status?: number
}

export const getOrderRequestStatusColorScheme = (
  status?: OrderRequestStatus,
) => {
  switch (status) {
    case OrderRequestStatus.CONFIRMED:
      return "green"
    case OrderRequestStatus.CANCELLED:
      return "red"
    case OrderRequestStatus.CONVERTED:
      return "blue"
    case OrderRequestStatus.DRAFT:
    default:
      return "yellow"
  }
}

export const getOrderRequestStatusLabel = (
  status?: OrderRequestStatus,
) => {
  switch (status) {
    case OrderRequestStatus.CONFIRMED:
      return "Confirmado"
    case OrderRequestStatus.CANCELLED:
      return "Cancelado"
    case OrderRequestStatus.CONVERTED:
      return "Convertido"
    case OrderRequestStatus.DRAFT:
    default:
      return "Borrador"
  }
}

export const getOrderRequestPaymentStatusColorScheme = (
  paymentStatus?: OrderRequestPaymentStatus,
) => {
  switch (paymentStatus) {
    case OrderRequestPaymentStatus.PAID:
      return "green"
    case OrderRequestPaymentStatus.PARTIALLY_PAID:
      return "orange"
    case OrderRequestPaymentStatus.UNPAID:
    default:
      return "red"
  }
}

export const getOrderRequestPaymentStatusLabel = (
  paymentStatus?: OrderRequestPaymentStatus,
) => {
  switch (paymentStatus) {
    case OrderRequestPaymentStatus.PAID:
      return "Pagado"
    case OrderRequestPaymentStatus.PARTIALLY_PAID:
      return "Pago parcial"
    case OrderRequestPaymentStatus.UNPAID:
    default:
      return "Pendiente"
  }
}

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage: string,
) => {
  const axiosError = error as AxiosError<ApiErrorResponse>
  return axiosError.response?.data?.message ?? fallbackMessage
}

export const calculateOrderRequestTotal = (
  items: IOrderRequestFormItem[] | undefined,
  products: IProductFullRelated[] | undefined,
  isRetail: boolean | undefined,
  discount: number | undefined,
) => {
  const productsById = new Map<string, IProductFullRelated>()

  products?.forEach((product) => {
    if (product._id !== undefined) {
      productsById.set(product._id, product)
    }
  })

  const rawTotal = (items ?? []).reduce((accumulator, item) => {
    const product = productsById.get(String(item.product))

    if (product === undefined) {
      return accumulator
    }

    const price = isRetail
      ? Number(product.retailsalePrice ?? 0)
      : Number(product.wholesalePrice ?? 0)

    return accumulator + price * Number(item.quantity ?? 0)
  }, 0)

  const normalizedDiscount = discount !== undefined && !Number.isNaN(discount)
    ? Number(discount) / 100
    : 0

  return rawTotal - rawTotal * normalizedDiscount
}

export const calculateOrderRequestSubtotal = (
  item: IOrderRequestFormItem | undefined,
  products: IProductFullRelated[] | undefined,
  isRetail: boolean | undefined,
  discount: number | undefined,
) => {
  if (item?.product === undefined) {
    return 0
  }

  const product = products?.find((currentProduct) => currentProduct._id === item.product)

  if (product === undefined) {
    return 0
  }

  const price = isRetail
    ? Number(product.retailsalePrice ?? 0)
    : Number(product.wholesalePrice ?? 0)

  const subtotal = price * Number(item.quantity ?? 0)
  const normalizedDiscount = discount !== undefined && !Number.isNaN(discount)
    ? Number(discount) / 100
    : 0

  return subtotal - subtotal * normalizedDiscount
}

export const buildOrderRequestItemPayloads = (
  items: IOrderRequestFormItem[] | undefined,
  orderRequestId: string,
  products: IProductFullRelated[] | undefined,
  isRetail: boolean | undefined,
  discount: number | undefined,
): IOrderRequestItemLessRelated[] => {
  return (items ?? []).map((item) => {
    const product = products?.find((currentProduct) => currentProduct._id === item.product)
    const unitPrice = isRetail
      ? Number(product?.retailsalePrice ?? 0)
      : Number(product?.wholesalePrice ?? 0)

    return {
      id: item.id,
      orderRequest: orderRequestId,
      product: item.product,
      quantity: Number(item.quantity ?? 0),
      unitPrice,
      subtotal: calculateOrderRequestSubtotal(item, products, isRetail, discount),
      variantSelections: (item.variantSelections ?? []).map((variantSelection) => ({
        id: variantSelection.id,
        productItem:
          typeof variantSelection.productItem === "string"
            ? variantSelection.productItem
            : variantSelection.productItem?._id,
        assetVariant:
          typeof variantSelection.assetVariant === "string"
            ? variantSelection.assetVariant
            : variantSelection.assetVariant?._id,
        quantity: Number(variantSelection.quantity ?? 0),
      })),
    }
  })
}

export const getInventoryNameByReservedItem = (
  reservedItem: IReservedOrderInventoryItem,
  inventories: IInventoryFullRelated[] | undefined,
  assetVariants?: IAssetVariant[] | undefined,
) => {
  const inventoryId =
    typeof reservedItem.inventory === "string"
      ? reservedItem.inventory
      : reservedItem.inventory?._id
  const assetId = reservedItem.asset
  const assetVariantId =
    typeof reservedItem.assetVariant === "string"
      ? reservedItem.assetVariant
      : reservedItem.assetVariant?._id

  const inventory = inventories?.find((currentInventory) => {
    const currentAssetVariantId =
      typeof currentInventory.assetVariant === "string"
        ? currentInventory.assetVariant
        : currentInventory.assetVariant?._id

    if (inventoryId && currentInventory._id === inventoryId) {
      return true
    }

    if (assetVariantId && currentAssetVariantId === assetVariantId) {
      return true
    }

    if (assetVariantId) {
      return false
    }

    return currentInventory.asset?._id === assetId
  })

  const assetVariantFromCatalog = assetVariantId
    ? assetVariants?.find((currentAssetVariant) => currentAssetVariant._id === assetVariantId)
    : undefined

  const assetVariant =
    (typeof reservedItem.assetVariant === "string"
      ? undefined
      : reservedItem.assetVariant) ??
    assetVariantFromCatalog ??
    (inventory?.assetVariant as IAssetVariant | undefined)

  if (assetVariant?.name) {
    return assetVariant.name
  }

  if (assetVariantId) {
    return assetVariantId
  }

  return inventory?.asset?.name ?? assetId ?? inventoryId ?? "-"
}

export const getPaymentMethodLabel = (paymentMethod?: string | { _id?: string, name?: string }) => {
  if (paymentMethod === undefined) {
    return "-"
  }

  if (typeof paymentMethod === "string") {
    return paymentMethod
  }

  return paymentMethod.name ?? paymentMethod._id ?? "-"
}

export const buildInitialPaymentPayload = (
  amount: number | undefined,
  paymentMethod: string | undefined,
  note: string | undefined,
): IAddOrderRequestPaymentPayload | undefined => {
  if (amount === undefined || Number(amount) <= 0) {
    return undefined
  }

  if (paymentMethod === undefined || paymentMethod === "") {
    return undefined
  }

  return {
    amount: Number(amount),
    paymentMethod,
    note,
  }
}
