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
} from "@chakra-ui/react"
import {
  Control,
  FormState,
  UseFormRegister,
  UseFormWatch,
  useFieldArray,
} from "react-hook-form"
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
}: Props) => {
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
                <Text fontSize="sm" color="gray.600">
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
                            />
                            {selectedVariantName && (
                              <Box mt={2} pl={1}>
                                <Text
                                  fontSize="sm"
                                  color="gray.700"
                                  fontWeight="medium"
                                  title={selectedVariantName}
                                >
                                  {selectedVariantName}
                                </Text>
                                {selectedVariantAttributes.length > 0 && (
                                  <Text
                                    mt={1}
                                    fontSize="xs"
                                    color="gray.500"
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
                      onClick={() =>
                        append({
                          productItem: productItemId,
                          assetVariant: "",
                          quantity: 1,
                        })
                      }
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
