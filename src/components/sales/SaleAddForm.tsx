// libs
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// types
import { ISaleLessRelated, ISaleFullRelated, ISaleItemOmitSale } from "./types"

import { saleSchema } from "./saleSchema"

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
  Checkbox,
  FormLabel,
  Input,
} from "@chakra-ui/react"

import { DeleteIcon } from "@chakra-ui/icons"

// components
import Loading from "../common/Loading"
import MyInput from "../ui/inputs/MyInput"
import MySelect from "../ui/inputs/MySelect"
import { IProductFullRelated } from "../products/types"
import { IClient } from "../clients/types"
import { IPaymentMethod } from "../paymentMethods/types"

interface Props {
  onSubmit: SubmitHandler<ISaleLessRelated>
  onCancelOperation: () => void
  saleToUpdate?: ISaleFullRelated
  products?: IProductFullRelated[]
  clients?: IClient[]
  paymentMethods?: IPaymentMethod[]
  isLoading: boolean
}

const SaleFormAdd = ({
  onSubmit,
  onCancelOperation,
  saleToUpdate,
  isLoading,
  products,
  clients,
  paymentMethods,
}: Props) => {
  const { register, formState, handleSubmit, control, watch } =
    useForm<ISaleLessRelated>({
      resolver: zodResolver(saleSchema),
      defaultValues: {
        isRetail: false,
        total: undefined,
        saleItems: [{ product: "", quantity: 1 }],
      },
      values: {
        isRetail: saleToUpdate?.isRetail || false,
        total: saleToUpdate?.total || undefined,
        saleItems: [{ product: "", quantity: 1 }],
      },
    })

  // suscripción para los fields
  const sale = watch()

  const { fields, remove, append } = useFieldArray({
    name: "saleItems",
    control,
  })

  const getTotalSale = () => {
    let productIds = sale?.saleItems?.map((saleItem) => saleItem.product)

    let productWithSalePrice: IProductFullRelated[] = []

    productIds?.forEach((productId) =>
      products?.forEach((product) => {
        if (product._id === productId) {
          productWithSalePrice.push(product)
        }
      })
    )

    let productWithQuantity: ISaleItemOmitSale[] = []

    productWithSalePrice.forEach((product) => {
      sale.saleItems?.forEach((saleItem) => {
        if (product._id === saleItem.product) {
          productWithQuantity.push({
            product,
            quantity: saleItem.quantity,
          })
        }
      })
    })

    let totalSale = productWithQuantity
      ?.map((productWithQ) => {
        if (
          productWithQ.product?.retailsalePrice !== undefined &&
          productWithQ.quantity !== undefined
        ) {
          if (sale.isRetail) {
            return (
              Number(productWithQ.product.retailsalePrice) *
              Number(productWithQ.quantity)
            )
          }
          return (
            Number(productWithQ.product.wholesalePrice) *
            Number(productWithQ.quantity)
          )
        }
      })
      .reduce((acc, currentValue) => {
        if (acc !== undefined && currentValue !== undefined) {
          return acc + currentValue
        }
      }, 0)

    return totalSale
  }

  const getSubtotal = (index: number) => {

    let subtotal: number = 0

    products?.filter(product => {
      if (product._id === sale.saleItems?.at(index)?.product) {

        let quantity = Number(sale?.saleItems?.at(index)?.quantity)

        if (sale !== undefined && sale?.isRetail) {
          subtotal = Number(product?.retailsalePrice) * quantity
        } else {
          subtotal = Number(product?.wholesalePrice) * quantity
        }
      }
    })

    return subtotal
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
                  Nueva venta:
                </Heading>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MySelect
                        formState={formState}
                        register={register}
                        field={"client"}
                        placeholder={"Buscar cliente ..."}
                        label={"Cliente"}
                        control={control}
                        data={clients}
                        isRequired={true}
                        noOptionsMessage="No hay datos"
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <FormControl>
                        <FormLabel>Total:</FormLabel>
                        <Input
                          value={new Intl.NumberFormat("en-US", {
                            style: "currency",
                            minimumFractionDigits: 2,
                            currency: "ARS",
                          }).format(getTotalSale() || 0)}
                          disabled={true}
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MySelect
                        formState={formState}
                        register={register}
                        field={"paymentMethod"}
                        placeholder={"Buscar método de pago ..."}
                        label={"Método de pago"}
                        control={control}
                        data={paymentMethods}
                        isRequired={true}
                        noOptionsMessage="No hay datos"
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <FormControl>
                        <FormLabel>Por menor?</FormLabel>
                        <Checkbox
                          type="checkbox"
                          colorScheme="purple"
                          placeholder="Por menor"
                          {...register("isRetail")}
                        >
                          Si
                        </Checkbox>
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
                  <Grid mb={4}>
                    <GridItem>
                      <FormControl>
                        <Text fontSize={"large"}>Seleccione los productos</Text>
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
                                    field={`saleItems.${index}.product`}
                                    register={register}
                                    control={control}
                                    formState={formState}
                                    label="Producto"
                                    placeholder="Buscar producto"
                                    data={products}
                                    isDisabled={false}
                                    isRequired={true}
                                  />
                                  <MyInput
                                    formState={formState}
                                    register={register}
                                    field={`saleItems.${index}.quantity`}
                                    type={"number"}
                                    placeholder={"Cantidad"}
                                    label={"Cantidad"}
                                  />
                                  <Text>
                                    Subtotal:{" "}
                                    {new Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      minimumFractionDigits: 2,
                                      currency: "ARS",
                                    }).format(
                                      getSubtotal(index)
                                    )}
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
                                    onClick={() => remove(index)}
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
                    onClick={() => append({ product: "", quantity: 1 })}
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
                      Guardar
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

export default SaleFormAdd
