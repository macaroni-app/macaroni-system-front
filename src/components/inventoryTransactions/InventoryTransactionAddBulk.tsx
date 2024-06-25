// libs
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// types
import { IInventoryTransactionLessRelatedBulk } from "./types"
import { IAssetFullCategory } from "../assets/types"
import { inventoryTransactionBulkSchema } from "./inventoryTransactionSchema"

import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
  Flex,
  SimpleGrid,
  IconButton,
} from "@chakra-ui/react"

import { DeleteIcon } from "@chakra-ui/icons"

// components
import Loading from "../common/Loading"
import MyInput from "../ui/inputs/MyInput"
import MySelect from "../ui/inputs/MySelect"


interface Props {
  onSubmit: SubmitHandler<IInventoryTransactionLessRelatedBulk>
  onCancelOperation: () => void
  isEditing: boolean
  isLoading: boolean
  assets: IAssetFullCategory[]
}

const InventoryTransactionAddBulkForm = ({
  onSubmit,
  onCancelOperation,
  isLoading,
  assets,
}: Props) => {
  const { register, formState, handleSubmit, control, watch } =
    useForm<IInventoryTransactionLessRelatedBulk>({
      resolver: zodResolver(inventoryTransactionBulkSchema),
      values: {
        inventoryTransactions: [{
          asset: '',
          affectedAmount:
            undefined,
          transactionType:
            undefined,
          transactionReason:
            undefined,
        }],
      },
    })

  // suscripción para los fields
  const inventoryTransactions = watch()

  const { fields, remove, append } = useFieldArray({
    name: "inventoryTransactions",
    control,
  })

  const getTransactinTypeOptions = () => {
    return [
      { _id: "UP", name: "Aumentar" },
      { _id: "DOWN", name: "Disminuir" },
    ]
  }

  const getTransactinReasonOptions = () => {
    return [
      { _id: "BUY", name: "Compra" },
      { _id: "SELL", name: "Venta" },
      { _id: "RETURN", name: "Devolución" },
      { _id: "ADJUSTMENT", name: "Ajuste" },
      { _id: "DONATION", name: "Donación" },
      { _id: "DEFEATED", name: "Vencido" },
      { _id: "LOSS", name: "Pérdida" },
      { _id: "INTERNAL_USAGE", name: "Uso interno" },
    ]
  }

  const getNoOptionMessage = () => {
    if (assets?.length === 0) {
      return "Todos los insumos ya tienen inventario"
    }
    return "No hay datos"
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
                  Agregar transacciones:
                </Heading>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>

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
                                    field={`inventoryTransactions.${index}.asset`}
                                    formState={formState}
                                    register={register}
                                    placeholder={"Buscar insumo ..."}
                                    label={"Insumo"}
                                    control={control}
                                    data={assets}
                                    isRequired={true}
                                    noOptionsMessage={getNoOptionMessage()}
                                  />
                                  <MySelect
                                    field={`inventoryTransactions.${index}.transactionType`}
                                    formState={formState}
                                    register={register}
                                    placeholder={"Seleccionar tipo ..."}
                                    label={"Tipo de transacción"}
                                    control={control}
                                    data={getTransactinTypeOptions()}
                                    isRequired={true}
                                    noOptionsMessage={getNoOptionMessage()}
                                  />
                                  <MySelect
                                    field={`inventoryTransactions.${index}.transactionReason`}
                                    formState={formState}
                                    register={register}
                                    placeholder={"Seleccionar motivo ..."}
                                    label={"Motivo de la transacción"}
                                    control={control}
                                    data={getTransactinReasonOptions()}
                                    isRequired={true}
                                    noOptionsMessage={getNoOptionMessage()}
                                  />
                                  <MyInput
                                    formState={formState}
                                    register={register}
                                    field={`inventoryTransactions.${index}.affectedAmount`}
                                    type={"number"}
                                    placeholder={"Cantidad"}
                                    label={"Cantidad"}
                                  />
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
                    onClick={() => append({
                      asset: '',
                      affectedAmount:
                        undefined,
                      transactionType:
                        undefined,
                      transactionReason:
                        undefined,
                    })}
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

export default InventoryTransactionAddBulkForm
