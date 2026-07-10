import { DeleteIcon } from "@chakra-ui/icons"
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  Grid,
  GridItem,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import {
  Control,
  FormState,
  UseFormRegister,
  UseFormWatch,
  useFieldArray,
} from "react-hook-form"
import { useEffect } from "react"
import { IAssetVariant } from "../assetVariants/types"
import {
  IProductItemFullRelated,
  ProductItemSelectionType,
} from "../products/types"
import MyInput from "../ui/inputs/MyInput"
import MySelect from "../ui/inputs/MySelect"
import {
  getAllowedAssetVariantsForProductItem,
  getAssetVariantAttributeChips,
  getAssetVariantName,
  getVariantSelectionCurrentQuantity,
  getVariantSelectionExpectedQuantity,
} from "../../utils/variants"

interface Props {
  name: string
  productId?: string
  lineQuantity?: number
  productItems?: IProductItemFullRelated[]
  assetVariants?: IAssetVariant[]
  register: UseFormRegister<any>
  control: Control<any, any>
  formState: FormState<any>
  watch: UseFormWatch<any>
  isReadOnly?: boolean
  inputIdPrefix?: string
  onVariantRowAdded?: (variantIndex: number) => void
  onRequestItemCompletion?: () => void
}

const VariantSelectionsEditor = ({
  name,
  productId,
  lineQuantity,
  productItems,
  assetVariants,
  register,
  control,
  formState,
  watch,
  isReadOnly = false,
  inputIdPrefix,
  onVariantRowAdded,
  onRequestItemCompletion,
}: Props) => {
  const mutedTextColor = useColorModeValue("gray.600", "gray.300")
  const subtleTextColor = useColorModeValue("gray.700", "gray.200")
  const subtleHintColor = useColorModeValue("gray.500", "gray.400")

  const { fields, append, remove } = useFieldArray({
    name,
    control,
  })

  const currentSelections = watch(name) ?? []

  const currentProductItems = (productItems ?? []).filter((productItem) => {
    const currentProductId =
      typeof productItem.product === "string"
        ? productItem.product
        : productItem.product?._id

    return (
      currentProductId === productId &&
      (productItem.selectionType ?? ProductItemSelectionType.FIXED) ===
        ProductItemSelectionType.VARIANT_SELECTION
    )
  })

  const focusById = (elementId: string) => {
    requestAnimationFrame(() => {
      document.getElementById(elementId)?.focus()
    })
  }

  const getProductItemIdFromSelection = (selection: any) =>
    typeof selection?.productItem === "string"
      ? selection.productItem
      : selection?.productItem?._id

  const getAssetVariantIdFromSelection = (selection: any) =>
    typeof selection?.assetVariant === "string"
      ? selection.assetVariant
      : selection?.assetVariant?._id

  const addVariantRow = (productItemId: string, shouldFocus = true) => {
    const nextIndex = fields.length
    append({
      productItem: productItemId,
      assetVariant: "",
      quantity: 1,
    })
    onVariantRowAdded?.(nextIndex)

    if (shouldFocus && inputIdPrefix) {
      setTimeout(() => {
        focusById(`${inputIdPrefix}-variant-${nextIndex}`)
      }, 0)
    }
  }

  useEffect(() => {
    if (isReadOnly || currentProductItems.length === 0) {
      return
    }

    const existingProductItemIds = new Set(
      currentSelections
        .map((selection) => getProductItemIdFromSelection(selection))
        .filter((value): value is string => !!value),
    )

    const missingProductItems = currentProductItems.filter(
      (productItem) => !!productItem._id && !existingProductItemIds.has(productItem._id),
    )

    if (missingProductItems.length === 0) {
      return
    }

    missingProductItems.forEach((productItem) => {
      if (productItem._id) {
        addVariantRow(productItem._id, false)
      }
    })
  }, [currentProductItems, currentSelections, isReadOnly])

  const focusVariantSelection = (absoluteIndex: number) => {
    if (!inputIdPrefix) {
      return
    }

    focusById(`${inputIdPrefix}-variant-${absoluteIndex}`)
  }

  const handleVariantQuantitySubmit = (productItemId: string) => {
    const productItem = currentProductItems.find(
      (currentProductItem) => currentProductItem._id === productItemId,
    )

    if (!productItem) {
      onRequestItemCompletion?.()
      return
    }

    const expectedQuantity = getVariantSelectionExpectedQuantity(
      productItem,
      lineQuantity,
    )
    const currentQuantity = getVariantSelectionCurrentQuantity(
      currentSelections,
      productItemId,
    )

    if (currentQuantity < expectedQuantity) {
      addVariantRow(productItemId)
      return
    }

    const nextIncompleteProductItem = currentProductItems.find(
      (currentProductItem) => {
        if (!currentProductItem._id) {
          return false
        }

        return (
          getVariantSelectionCurrentQuantity(
            currentSelections,
            currentProductItem._id,
          ) <
          getVariantSelectionExpectedQuantity(currentProductItem, lineQuantity)
        )
      },
    )

    if (nextIncompleteProductItem?._id) {
      const nextSelectionIndex = currentSelections.findIndex((selection) => {
        const currentProductItemId = getProductItemIdFromSelection(selection)
        const currentAssetVariantId = getAssetVariantIdFromSelection(selection)

        return (
          currentProductItemId === nextIncompleteProductItem._id &&
          (!currentAssetVariantId || String(currentAssetVariantId).trim().length === 0)
        )
      })

      if (nextSelectionIndex >= 0) {
        focusVariantSelection(nextSelectionIndex)
        return
      }

      addVariantRow(nextIncompleteProductItem._id)
      return
    }

    onRequestItemCompletion?.()
  }

  if (!productId || currentProductItems.length === 0) {
    return null
  }

  return (
    <Flex direction="column" gap={3}>
      {currentProductItems.map((productItem) => {
        const productItemId = productItem._id
        const filteredSelections = fields
          .map((field, absoluteIndex) => ({ field, absoluteIndex }))
          .filter(({ absoluteIndex }) => {
            const currentSelection = currentSelections[absoluteIndex]
            const currentProductItemId =
              typeof currentSelection?.productItem === "string"
                ? currentSelection.productItem
                : currentSelection?.productItem?._id

            return currentProductItemId === productItemId
          })

        const allowedAssetVariants = getAllowedAssetVariantsForProductItem(
          productItem,
          assetVariants ?? [],
        )
        const expectedQuantity = getVariantSelectionExpectedQuantity(
          productItem,
          lineQuantity,
        )
        const currentQuantity = getVariantSelectionCurrentQuantity(
          currentSelections,
          productItemId,
        )

        return (
          <Card key={productItemId} variant="outline">
            <CardBody>
              <Flex direction="column" gap={3}>
                <Text fontWeight="semibold">
                  Variantes para{" "}
                  {typeof productItem.baseAsset === "string"
                    ? productItem.baseAsset
                    : productItem.baseAsset?.name ?? "Insumo base"}
                </Text>
                <Text fontSize="sm" color={mutedTextColor}>
                  Debés distribuir {expectedQuantity} unidad/es. Cargadas:{" "}
                  {currentQuantity}.
                </Text>

                {filteredSelections.map(({ field, absoluteIndex }) => {
                  const currentSelection = currentSelections[absoluteIndex]
                  const selectedAssetVariantId =
                    typeof currentSelection?.assetVariant === "string"
                      ? currentSelection.assetVariant
                      : currentSelection?.assetVariant?._id
                  const selectedAssetVariant = allowedAssetVariants.find(
                    (assetVariant) => assetVariant._id === selectedAssetVariantId,
                  )
                  const selectedVariantName = getAssetVariantName(
                    selectedAssetVariant,
                  )
                  const selectedVariantAttributes = getAssetVariantAttributeChips(
                    selectedAssetVariant,
                  )

                  return (
                    <Card key={field.id} variant="outline">
                      <CardBody p="3">
                        <Grid
                          templateColumns={{
                            base: "1fr",
                            md: "minmax(0, 2.6fr) minmax(120px, 0.8fr) 44px",
                          }}
                          gap={3}
                          alignItems="start"
                        >
                          <GridItem minW={0}>
                            <input
                              type="hidden"
                              {...register(
                                `${name}.${absoluteIndex}.productItem`,
                              )}
                            />
                            <MySelect
                              field={`${name}.${absoluteIndex}.assetVariant`}
                              register={register}
                              control={control}
                              formState={formState}
                              label="Variante"
                              placeholder="Buscar variante"
                              data={allowedAssetVariants as never}
                              isDisabled={isReadOnly}
                              isRequired={true}
                              inputId={
                                inputIdPrefix
                                  ? `${inputIdPrefix}-variant-${absoluteIndex}`
                                  : undefined
                              }
                              onValueChange={() => {
                                if (!inputIdPrefix) {
                                  return
                                }
                                requestAnimationFrame(() => {
                                  document
                                    .getElementById(
                                      `${inputIdPrefix}-variant-quantity-${absoluteIndex}`,
                                    )
                                    ?.focus()
                                })
                              }}
                            />
                            {selectedVariantName && (
                              <Box mt={2} pl={1}>
                                <Text
                                  fontSize="sm"
                                  color={subtleTextColor}
                                  fontWeight="medium"
                                  title={selectedVariantName}
                                >
                                  {selectedVariantName}
                                </Text>
                                {selectedVariantAttributes.length > 0 && (
                                  <Text
                                    mt={1}
                                    fontSize="xs"
                                    color={subtleHintColor}
                                    title={selectedVariantAttributes
                                      .map(
                                        (attribute) =>
                                          `${attribute.attributeName}: ${attribute.valueName}`,
                                      )
                                      .join(" · ")}
                                  >
                                    {selectedVariantAttributes
                                      .map(
                                        (attribute) =>
                                          `${attribute.attributeName}: ${attribute.valueName}`,
                                      )
                                      .join(" · ")}
                                  </Text>
                                )}
                              </Box>
                            )}
                          </GridItem>

                          <GridItem minW={0}>
                            <MyInput
                              formState={formState}
                              register={register}
                              field={`${name}.${absoluteIndex}.quantity`}
                              type="number"
                              placeholder="Cantidad"
                              label="Cantidad"
                              isDisabled={isReadOnly}
                              inputId={
                                inputIdPrefix
                                  ? `${inputIdPrefix}-variant-quantity-${absoluteIndex}`
                                  : undefined
                              }
                              onKeyDown={(event) => {
                                if (event.key !== "Enter" || event.ctrlKey) {
                                  return
                                }

                                event.preventDefault()
                                if (productItemId) {
                                  handleVariantQuantitySubmit(productItemId)
                                }
                              }}
                            />
                          </GridItem>

                          <GridItem
                            display="flex"
                            justifyContent={{ base: "flex-end", md: "center" }}
                            alignItems={{ base: "flex-start", md: "center" }}
                            pt={{ base: 0, md: 8 }}
                          >
                            <IconButton
                              aria-label="Eliminar variante"
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              variant="ghost"
                              isDisabled={isReadOnly}
                              onClick={() => remove(absoluteIndex)}
                            />
                          </GridItem>
                        </Grid>
                      </CardBody>
                    </Card>
                  )
                })}

                {!isReadOnly && (
                  <FormControl>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (productItemId) {
                          addVariantRow(productItemId)
                        }
                      }}
                    >
                      Agregar variante
                    </Button>
                  </FormControl>
                )}
              </Flex>
            </CardBody>
          </Card>
        )
      })}
    </Flex>
  )
}

export default VariantSelectionsEditor
