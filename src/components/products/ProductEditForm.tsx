// libs
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// types
import {
  IProductItemOmitProduct,
  IProductFullRelated,
  IProductItemLessRelated,
  IProductItemFullRelated,
  IProductItemPreview,
  IProductLessRelated,
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
  productItems,
}: Props) => {
  const { showMessage } = useMessage()

  const productItemInitial: IProductItemPreview[] = []

  productItems?.filter((productItem) => {
    if (productItem.product?._id === productToUpdate?._id) {
      productItemInitial.push({
        asset: productItem.asset?._id,
        quantity: productItem.quantity,
        id: productItem._id,
      })
    }
  })

  const { register, formState, handleSubmit, control, watch } =
    useForm<IProductLessRelated>({
      resolver: zodResolver(productSchema),
      values: {
        name: productToUpdate?.name || "",
        wholesalePrice: productToUpdate?.wholesalePrice || undefined,
        retailsalePrice: productToUpdate?.retailsalePrice || undefined,
        category: productToUpdate?.category?._id,
        productType: productToUpdate?.productType?._id,
        productItems: productItemInitial,
      },
    })

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

  const getCostTotal = () => {
    let assetIds = product?.productItems?.map(
      (productItem) => productItem.asset
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
        if (asset._id === productItem.asset) {
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
          if (asset?._id === product?.productItems?.at(index)?.asset) {
            return asset?.costPrice
          }
        })[0]?.costPrice || 0

      const quantityLine = product.productItems?.at(index)?.quantity || 0
      return assetLine * Number(quantityLine)
    }
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
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MyInput
                        formState={formState}
                        register={register}
                        field={"name"}
                        type={"text"}
                        placeholder={"Nombre producto"}
                        label={"Nombre"}
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
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
                                  <MyInput
                                    formState={formState}
                                    register={register}
                                    field={`productItems.${index}.quantity`}
                                    type={"number"}
                                    placeholder={"Cantidad"}
                                    label={"Cantidad"}
                                  />
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
                    onClick={() => append({ asset: "", quantity: 1 })}
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
