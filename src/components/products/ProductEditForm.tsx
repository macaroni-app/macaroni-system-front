// libs
import { useEffect } from "react"
import { SubmitHandler, useFieldArray, useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Select from "react-select"

// types
import {
  IProductItemOmitProduct,
  IProductFullRelated,
  IProductItemLessRelated,
  IProductItemFullRelated,
  IProductItemPreview,
  IProductLessRelated,
  ProductItemSelectionType,
} from "./types"

import { productSchema } from "./productSchema"

import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  Heading,
  FormControl,
  Stack,
  Text,
  Flex,
  SimpleGrid,
  IconButton,
  Divider,
  Input,
  FormLabel,
} from "@chakra-ui/react"

import { DeleteIcon } from "@chakra-ui/icons"

// components
import Loading from "../common/Loading"
import MyInput from "../ui/inputs/MyInput"
import MySelect from "../ui/inputs/MySelect"

// types
import { ICategory } from "../categories/types"
import { IProductTypeType } from "../productTypes/types"
import { IAssetFullCategory } from "../assets/types"
import { IVariantAttributeValue } from "../variantAttributeValues/types"

// custom hooks
import { useMessage } from "../../hooks/useMessage"
import { useDeleteManyProductItem } from "../../hooks/useDeleteManyProductItem"

import { ASSET_DELETED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

interface Props {
  onSubmit: SubmitHandler<IProductLessRelated>
  onCancelOperation: () => void
  productToUpdate?: IProductFullRelated
  categories?: ICategory[]
  productTypes?: IProductTypeType[]
  assets?: IAssetFullCategory[]
  variantAttributeValues?: IVariantAttributeValue[]
  productItems: IProductItemFullRelated[]
  isLoading: boolean
}

const ProductFormEdit = ({
  onSubmit,
  onCancelOperation,
  productToUpdate,
  isLoading,
  categories,
  productTypes,
  assets,
  variantAttributeValues,
  productItems,
}: Props) => {
  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : undefined

  const { showMessage } = useMessage()

  const productItemInitial: IProductItemPreview[] = []

  productItems?.filter((productItem) => {
    if (productItem.product?._id === productToUpdate?._id) {
      productItemInitial.push({
        asset: productItem.asset?._id,
        baseAsset:
          typeof productItem.baseAsset === "string"
            ? productItem.baseAsset
            : productItem.baseAsset?._id,
        selectionType:
          productItem.selectionType ?? ProductItemSelectionType.FIXED,
        allowedVariantValues: (productItem.allowedVariantValues ?? []).map(
          (value) => (typeof value === "string" ? value : String(value._id)),
        ),
        quantity: productItem.quantity,
        id: productItem._id,
      })
    }
  })

  const { register, formState, handleSubmit, control, watch, reset } =
    useForm<IProductLessRelated>({
      resolver: zodResolver(productSchema),
      defaultValues: {
        name: productToUpdate?.name || "",
        wholesalePrice: productToUpdate?.wholesalePrice || undefined,
        retailsalePrice: productToUpdate?.retailsalePrice || undefined,
        category: productToUpdate?.category?._id,
        productType: productToUpdate?.productType?._id,
        productItems: productItemInitial,
      },
    })

  useEffect(() => {
    reset({
      name: productToUpdate?.name || "",
      wholesalePrice: productToUpdate?.wholesalePrice || undefined,
      retailsalePrice: productToUpdate?.retailsalePrice || undefined,
      category: productToUpdate?.category?._id,
      productType: productToUpdate?.productType?._id,
      productItems: productItemInitial,
    })
  }, [productToUpdate, productItems, reset])

  // suscripción para los fields
  const product = watch()

  const { fields, remove, append } = useFieldArray({
    name: "productItems",
    control,
  })

  const { deleteManyProductItem } = useDeleteManyProductItem()

  const handleRemoveProductItem = async (index: number): Promise<void> => {
    remove(index)
    const productItemsToDelete: IProductItemPreview[] = []
    product?.productItems?.forEach((field, currentIndex) => {
      if (currentIndex === index) {
        productItemsToDelete.push(field)
      }
    })
    const response = await deleteManyProductItem(
      productItemsToDelete as IProductItemLessRelated[]
    )

    if (
      response.isDeleted &&
      response.status === 200 &&
      response.data.deletedCount > 0
    ) {
      showMessage(ASSET_DELETED, AlertStatus.Success, AlertColorScheme.Purple)
    }
  }

  const getAssetIdForCost = (index: number) => {
    const currentProductItem = product?.productItems?.at(index)
    if (!currentProductItem) return undefined

    return currentProductItem.selectionType ===
      ProductItemSelectionType.VARIANT_SELECTION
      ? currentProductItem.baseAsset
      : currentProductItem.asset
  }

  const getCostTotal = () => {
    let assetIds = product?.productItems?.map(
      (productItem) =>
        productItem.selectionType === ProductItemSelectionType.VARIANT_SELECTION
          ? productItem.baseAsset
          : productItem.asset
    )

    let assetWithCostPrice: IAssetFullCategory[] = []

    assetIds?.forEach((assetId) =>
      assets?.forEach((asset) => {
        if (asset._id === assetId) {
          assetWithCostPrice.push(asset)
        }
      })
    )

    let assetWithQuantity: IProductItemOmitProduct[] = []

    assetWithCostPrice.forEach((asset) => {
      product.productItems?.forEach((productItem) => {
        const currentAssetId =
          productItem.selectionType === ProductItemSelectionType.VARIANT_SELECTION
            ? productItem.baseAsset
            : productItem.asset

        if (asset._id === currentAssetId) {
          assetWithQuantity.push({
            asset,
            quantity: productItem.quantity,
          })
        }
      })
    })

    let totalCost = assetWithQuantity
      ?.map((assetWithQ) => {
        if (
          assetWithQ.asset?.costPrice !== undefined &&
          assetWithQ.quantity !== undefined
        ) {
          return assetWithQ.asset.costPrice * Number(assetWithQ.quantity)
        }
      })
      .reduce((acc, currentValue) => {
        if (acc !== undefined && currentValue !== undefined) {
          return acc + currentValue
        }
      }, 0)

    return totalCost
  }

  const getCostSubtotal = (index: number) => {
    if (assets !== undefined && product !== undefined && index !== undefined) {
      const assetLine =
        assets?.filter((asset) => {
          if (asset?._id === getAssetIdForCost(index)) {
            return asset?.costPrice
          }
        })[0]?.costPrice || 0

      const quantityLine = product.productItems?.at(index)?.quantity || 0
      return assetLine * Number(quantityLine)
    }
  }

  const getRevenuePorcentage = () => {
    const costTotal = getCostTotal()

    const revenuePorcentage = Number(
      (
        ((Number(product?.wholesalePrice) - Number(costTotal)) /
          Number(costTotal)) *
        100
      ).toFixed(2)
    )

    if (revenuePorcentage > 0 && revenuePorcentage !== Infinity) {
      return revenuePorcentage
    }
    return 0
  }

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <Grid templateColumns={{ base: "repeat(12, 1fr)" }} mt={5} mb={10}>
          <GridItem colSpan={{ base: 10, md: 8 }} colStart={{ base: 2, md: 3 }}>
            <Card mb={10} variant="outline">
              <CardBody>
                <Heading mb={3} textAlign="center" size="lg">
                  Actualizar producto:
                </Heading>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12, md: 4 }}>
                      <MyInput
                        formState={formState}
                        register={register}
                        field={"name"}
                        type={"text"}
                        placeholder={"Nombre producto"}
                        label={"Nombre"}
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 4 }}>
                      <FormControl>
                        <FormLabel>Costo total:</FormLabel>
                        <Input
                          value={new Intl.NumberFormat("en-US", {
                            style: "currency",
                            minimumFractionDigits: 2,
                            currency: "ARS",
                          }).format(getCostTotal() || 0)}
                          disabled={true}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 4 }}>
                      <FormControl>
                        <FormLabel>Porcentaje de ganancia:</FormLabel>
                        <Input
                          value={`${getRevenuePorcentage()}%`}
                          type="text"
                          disabled={true}
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MyInput
                        formState={formState}
                        register={register}
                        field={"retailsalePrice"}
                        type={"number"}
                        placeholder={"Precio por menor"}
                        label={"Precio por menor"}
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MyInput
                        formState={formState}
                        register={register}
                        field={"wholesalePrice"}
                        type={"number"}
                        placeholder={"Precio por mayor"}
                        label={"Precio por mayor"}
                      />
                    </GridItem>
                  </Grid>

                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MySelect
                        formState={formState}
                        register={register}
                        field={"category"}
                        placeholder={"Buscar categoria ..."}
                        label={"Categoria"}
                        control={control}
                        data={categories}
                        isRequired={true}
                        noOptionsMessage="No hay datos"
                      />
                    </GridItem>

                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MySelect
                        formState={formState}
                        register={register}
                        field={"productType"}
                        placeholder={"Buscar tipo de producto ..."}
                        label={"Tipo de producto"}
                        control={control}
                        data={productTypes}
                        isRequired={true}
                        noOptionsMessage="No hay datos"
                      />
                    </GridItem>
                  </Grid>

                  <Grid mb={4}>
                    <GridItem>
                      <FormControl>
                        <Divider orientation="horizontal" />
                      </FormControl>
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <FormControl>
                        <Text fontSize={"large"}>
                          Seleccione los insumos del producto
                        </Text>
                      </FormControl>
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <FormControl>
                        <Divider orientation="horizontal" />
                      </FormControl>
                    </GridItem>
                  </Grid>

                  {fields.map((field, index) => {
                    return (
                      <Flex key={index} direction={"column"} gap={1}>
                        <Card variant={"outline"} mb={2}>
                          <CardBody p="0">
                            <Grid
                              templateColumns="repeat(6, 1fr)"
                              key={field.id}
                            >
                              <GridItem colSpan={5}>
                                <SimpleGrid
                                  columns={{ md: 2 }}
                                  spacing="2"
                                  p="2"
                                  alignItems={"center"}
                                >
                                  <MySelect
                                    field={`productItems.${index}.selectionType`}
                                    register={register}
                                    control={control}
                                    formState={formState}
                                    label="Tipo de componente"
                                    placeholder="Seleccionar tipo"
                                    data={[
                                      {
                                        _id: ProductItemSelectionType.FIXED,
                                        name: "Insumo fijo",
                                      },
                                      {
                                        _id:
                                          ProductItemSelectionType.VARIANT_SELECTION,
                                        name: "Elegir variante al vender",
                                      },
                                    ] as never}
                                    isDisabled={false}
                                    isRequired={true}
                                  />
                                  {(product.productItems?.at(index)?.selectionType ??
                                    ProductItemSelectionType.FIXED) ===
                                  ProductItemSelectionType.VARIANT_SELECTION ? (
                                    <MySelect
                                      field={`productItems.${index}.baseAsset`}
                                      register={register}
                                      control={control}
                                      formState={formState}
                                      label="Insumo base"
                                      placeholder="Buscar insumo base"
                                      data={assets}
                                      isDisabled={false}
                                      isRequired={true}
                                    />
                                  ) : (
                                    <MySelect
                                      field={`productItems.${index}.asset`}
                                      register={register}
                                      control={control}
                                      formState={formState}
                                      label="Insumo"
                                      placeholder="Buscar insumo"
                                      data={assets}
                                      isDisabled={false}
                                      isRequired={true}
                                    />
                                  )}
                                  <MyInput
                                    formState={formState}
                                    register={register}
                                    field={`productItems.${index}.quantity`}
                                    type={"number"}
                                    placeholder={"Cantidad"}
                                    label={"Cantidad"}
                                  />
                                  {(product.productItems?.at(index)?.selectionType ??
                                    ProductItemSelectionType.FIXED) ===
                                    ProductItemSelectionType.VARIANT_SELECTION && (
                                    <FormControl>
                                      <FormLabel>Atributos permitidos</FormLabel>
                                      <Text fontSize="sm" color="gray.600">
                                        Si no elegís valores, se podrán usar todas
                                        las variantes del insumo base.
                                      </Text>
                                      <Controller
                                        control={control}
                                        name={`productItems.${index}.allowedVariantValues`}
                                        render={({ field }) => (
                                          <Select
                                            isMulti
                                            placeholder="Seleccionar variantes permitidas"
                                            options={variantAttributeValues?.map((value) => ({
                                              value: String(value._id),
                                              label: value.name,
                                            }))}
                                            value={(variantAttributeValues ?? [])
                                              .filter((value) =>
                                                (field.value ?? []).includes(
                                                  String(value._id),
                                                )
                                              )
                                              .map((value) => ({
                                                value: String(value._id),
                                                label: value.name,
                                              }))}
                                            menuPortalTarget={menuPortalTarget}
                                            menuPosition="fixed"
                                            styles={{
                                              menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                              }),
                                            }}
                                            onChange={(selectedOptions) => {
                                              field.onChange(
                                                selectedOptions.map(
                                                  (option) => option.value
                                                )
                                              )
                                            }}
                                          />
                                        )}
                                      />
                                    </FormControl>
                                  )}
                                  <Text>
                                    Subtotal de costo:{" "}
                                    {new Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      minimumFractionDigits: 2,
                                      currency: "ARS",
                                    }).format(getCostSubtotal(index) || 0)}
                                  </Text>
                                </SimpleGrid>
                              </GridItem>
                              <GridItem
                                colSpan={1}
                                alignSelf={"center"}
                                justifySelf={"end"}
                              >
                                {fields.length > 1 && (
                                  <IconButton
                                    variant={"outline"}
                                    colorScheme="red"
                                    me={2}
                                    onClick={() =>
                                      handleRemoveProductItem(index)
                                    }
                                    icon={<DeleteIcon />}
                                    aria-label={""}
                                  />
                                )}
                              </GridItem>
                            </Grid>
                          </CardBody>
                        </Card>
                      </Flex>
                    )
                  })}
                  <Button
                    key={"addRows"}
                    variant="ghost"
                    size={"sm"}
                    colorScheme="blue"
                    alignSelf={"start"}
                    onClick={() =>
                      append({
                        asset: "",
                        baseAsset: "",
                        selectionType: ProductItemSelectionType.FIXED,
                        quantity: 1,
                        allowedVariantValues: [],
                      })
                    }
                  >
                    Agregar item
                  </Button>

                  <Stack
                    mt={6}
                    spacing={3}
                    direction={{ base: "column", md: "row" }}
                    justifyContent={"end"}
                  >
                    <Button
                      isLoading={isLoading}
                      type="submit"
                      colorScheme="purple"
                      variant="solid"
                    >
                      Actualizar
                    </Button>
                    <Button
                      onClick={() => onCancelOperation()}
                      colorScheme="gray"
                      variant="solid"
                    >
                      Cancelar
                    </Button>
                  </Stack>
                </form>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      )}
    </>
  )
}

export default ProductFormEdit
