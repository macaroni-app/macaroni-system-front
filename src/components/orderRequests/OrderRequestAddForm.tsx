import { zodResolver } from "@hookform/resolvers/zod"
import { DeleteIcon } from "@chakra-ui/icons"
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  SimpleGrid,
  Text,
} from "@chakra-ui/react"
import { useEffect } from "react"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { IClient } from "../clients/types"
import Loading from "../common/Loading"
import { IPaymentMethod } from "../paymentMethods/types"
import { IProductFullRelated } from "../products/types"
import MyInput from "../ui/inputs/MyInput"
import MySelect from "../ui/inputs/MySelect"
import { calculateOrderRequestSubtotal, calculateOrderRequestTotal } from "./helpers"
import { orderRequestSchema } from "./orderRequestSchema"
import { IOrderRequestFullRelated, IOrderRequestLessRelated, OrderRequestStatus } from "./types"

interface Props {
  onSubmit: SubmitHandler<IOrderRequestLessRelated>
  onCancelOperation: () => void
  orderRequestToUpdate?: IOrderRequestFullRelated
  products?: IProductFullRelated[]
  clients?: IClient[]
  paymentMethods?: IPaymentMethod[]
  isLoading: boolean
}

const OrderRequestAddForm = ({
  onSubmit,
  onCancelOperation,
  orderRequestToUpdate,
  isLoading,
  products,
  clients,
  paymentMethods,
}: Props) => {
  const isReadOnly = [
    OrderRequestStatus.CANCELLED,
    OrderRequestStatus.CONVERTED,
  ].includes(orderRequestToUpdate?.status as OrderRequestStatus)
  const shouldShowInitialPaymentFields =
    orderRequestToUpdate?._id === undefined ||
    (orderRequestToUpdate.payments?.length ?? 0) === 0

  const { register, formState, handleSubmit, control, watch, reset } =
    useForm<IOrderRequestLessRelated>({
      resolver: zodResolver(orderRequestSchema),
      defaultValues: {
        isRetail: false,
        total: undefined,
        discount: 0,
        initialPaymentAmount: undefined,
        initialPaymentMethod: "",
        initialPaymentNote: "",
        items: [{ product: "", quantity: 1 }],
      },
    })

  useEffect(() => {
    reset({
      isRetail: orderRequestToUpdate?.isRetail ?? false,
      total: orderRequestToUpdate?.total,
      discount: Number(orderRequestToUpdate?.discount ?? 0),
      client:
        orderRequestToUpdate?.client?._id ??
        clients?.find((client) => client.name === "Consumidor Final")?._id ??
        "",
      items:
        orderRequestToUpdate?.items?.map((item) => ({
          id: item._id,
          product: item.product?._id,
          quantity: Number(item.quantity ?? 1),
        })) ?? [{ product: "", quantity: 1 }],
      initialPaymentAmount: undefined,
      initialPaymentMethod: "",
      initialPaymentNote: "",
    })
  }, [clients, orderRequestToUpdate, reset])

  const orderRequest = watch()

  const { fields, remove, append, replace } = useFieldArray({
    name: "items",
    control,
  })

  useEffect(() => {
    const items =
      orderRequestToUpdate?.items?.map((item) => ({
        id: item._id,
        product: item.product?._id ?? "",
        quantity: Number(item.quantity ?? 1),
      })) ?? [{ product: "", quantity: 1 }]

    replace(items)
  }, [orderRequestToUpdate?.items, replace])

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <Grid templateColumns={{ base: "repeat(12, 1fr)" }} mt={5} mb={10}>
          <GridItem colSpan={{ base: 10, md: 8 }} colStart={{ base: 2, md: 3 }}>
            <Card mb={10} variant="outline">
              <CardBody>
                <Heading mb={3} textAlign="center" size="lg">
                  {orderRequestToUpdate?._id ? "Editar pedido:" : "Nuevo pedido:"}
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
                    <GridItem colSpan={{ base: 12, md: 3 }}>
                      <FormControl>
                        <FormLabel>Total:</FormLabel>
                        <Input
                          value={new Intl.NumberFormat("en-US", {
                            style: "currency",
                            minimumFractionDigits: 2,
                            currency: "ARS",
                          }).format(
                            calculateOrderRequestTotal(
                              orderRequest.items,
                              products,
                              orderRequest.isRetail,
                              orderRequest.discount,
                            ) || 0,
                          )}
                          disabled={true}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 3 }}>
                      <MyInput
                        formState={formState}
                        register={register}
                        field={"discount"}
                        type={"number"}
                        placeholder={"Descuento"}
                        label={"Descuento"}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <FormControl>
                        <FormLabel>Por menor?</FormLabel>
                        <Checkbox
                          type="checkbox"
                          colorScheme="purple"
                          placeholder="Por menor"
                          {...register("isRetail")}
                          isDisabled={isReadOnly}
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
                  {shouldShowInitialPaymentFields && (
                    <>
                      <Grid mb={4}>
                        <GridItem>
                          <Text fontSize={"large"}>Pago inicial opcional</Text>
                        </GridItem>
                      </Grid>
                      <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                        <GridItem colSpan={{ base: 12, md: 4 }}>
                          <MyInput
                            formState={formState}
                            register={register}
                            field={"initialPaymentAmount"}
                            type={"number"}
                            placeholder={"Monto entregado"}
                            label={"Monto entregado"}
                            isDisabled={isReadOnly}
                          />
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 4 }}>
                          <MySelect
                            formState={formState}
                            register={register}
                            field={"initialPaymentMethod"}
                            placeholder={"Buscar método de pago ..."}
                            label={"Método de pago"}
                            control={control}
                            data={paymentMethods}
                            noOptionsMessage="No hay datos"
                            isDisabled={isReadOnly}
                          />
                        </GridItem>
                        <GridItem colSpan={{ base: 12, md: 4 }}>
                          <MyInput
                            formState={formState}
                            register={register}
                            field={"initialPaymentNote"}
                            type={"text"}
                            placeholder={"Observación"}
                            label={"Observación"}
                            isDisabled={isReadOnly}
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
                    </>
                  )}
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

                  {fields.map((field, index) => (
                    <Flex key={field.id} direction={"column"} gap={1}>
                      <Card variant={"outline"} mb={2}>
                        <CardBody p="0">
                          <Grid templateColumns="repeat(6, 1fr)">
                            <GridItem colSpan={5}>
                              <SimpleGrid
                                columns={{ md: 2 }}
                                spacing="2"
                                p="2"
                                alignItems={"center"}
                              >
                                <MySelect
                                  field={`items.${index}.product`}
                                  register={register}
                                  control={control}
                                  formState={formState}
                                  label="Producto"
                                  placeholder="Buscar producto"
                                  data={products}
                                  isDisabled={isReadOnly}
                                  isRequired={true}
                                />
                                <MyInput
                                  formState={formState}
                                  register={register}
                                  field={`items.${index}.quantity`}
                                  type={"number"}
                                  placeholder={"Cantidad"}
                                  label={"Cantidad"}
                                  isDisabled={isReadOnly}
                                />
                                <Text>
                                  Subtotal:{" "}
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    minimumFractionDigits: 2,
                                    currency: "ARS",
                                  }).format(
                                    calculateOrderRequestSubtotal(
                                      orderRequest.items?.at(index),
                                      products,
                                      orderRequest.isRetail,
                                      orderRequest.discount,
                                    ),
                                  )}
                                </Text>
                              </SimpleGrid>
                            </GridItem>
                            <GridItem
                              colSpan={1}
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <IconButton
                                aria-label="Eliminar item"
                                icon={<DeleteIcon />}
                                colorScheme="red"
                                variant="ghost"
                                isDisabled={isReadOnly || fields.length === 1}
                                onClick={() => remove(index)}
                              />
                            </GridItem>
                          </Grid>
                        </CardBody>
                      </Card>
                    </Flex>
                  ))}

                  {!isReadOnly && (
                    <Button
                      mb={4}
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => append({ product: "", quantity: 1 })}
                    >
                      Agregar producto
                    </Button>
                  )}

                  <Flex gap={3} justifyContent="flex-end">
                    <Button variant="outline" onClick={onCancelOperation}>
                      Cancelar
                    </Button>
                    {!isReadOnly && (
                      <Button colorScheme="purple" type="submit">
                        Guardar pedido
                      </Button>
                    )}
                  </Flex>
                </form>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      )}
    </>
  )
}

export default OrderRequestAddForm
