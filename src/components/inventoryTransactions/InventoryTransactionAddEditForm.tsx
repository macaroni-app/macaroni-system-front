import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
} from "@chakra-ui/react"

// Components
import MyInput from "../ui/inputs/MyInput"
import Loading from "../common/Loading"
import MySelect from "../ui/inputs/MySelect"

// libs
import { zodResolver } from "@hookform/resolvers/zod"

// custom hook
import { SubmitHandler, useForm } from "react-hook-form"

// types
import {
  IInventoryTransactionFullRelated,
  IInventoryTransactionLessRelated,
} from "./types"
import { IAssetFullCategory } from "../assets/types"
import { inventoryTransactionSchema } from "./inventoryTransactionSchema"

interface Props {
  onSubmit: SubmitHandler<IInventoryTransactionLessRelated>
  onCancelOperation: () => void
  inventoryTransactionToUpdate?: IInventoryTransactionFullRelated
  isEditing: boolean
  isLoading: boolean
  assets: IAssetFullCategory[]
}

const InventoryTransactionAddEditForm = (props: Props) => {
  const {
    onSubmit,
    onCancelOperation,
    inventoryTransactionToUpdate,
    isEditing,
    isLoading,
    assets,
  } = props

  const { register, formState, handleSubmit, control } =
    useForm<IInventoryTransactionLessRelated>({
      resolver: zodResolver(inventoryTransactionSchema),
      values: {
        asset: inventoryTransactionToUpdate?.asset?._id,
        affectedAmount:
          inventoryTransactionToUpdate?.affectedAmount || undefined,
        transactionType:
          inventoryTransactionToUpdate?.transactionType || undefined,
        transactionReason:
          inventoryTransactionToUpdate?.transactionReason || undefined,
      },
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
        <Grid templateColumns={{ base: "repeat(12, 1fr)" }} mt={5}>
          <GridItem colSpan={{ base: 10, md: 8 }} colStart={{ base: 2, md: 3 }}>
            <Card mb={3} variant="outline">
              <CardBody>
                <Heading mb={3} textAlign="center" size="lg">
                  {!isEditing
                    ? "Nueva transacción de inventario"
                    : "Modificar transacción de inventario"}
                </Heading>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Grid mb={4}>
                    <GridItem>
                      <MySelect
                        formState={formState}
                        register={register}
                        field={"asset"}
                        placeholder={"Buscar insumo ..."}
                        label={"Insumo"}
                        control={control}
                        data={assets}
                        isRequired={true}
                        noOptionsMessage={getNoOptionMessage()}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <MySelect
                        formState={formState}
                        register={register}
                        field={"transactionType"}
                        placeholder={"Seleccionar tipo ..."}
                        label={"Tipo de transacción"}
                        control={control}
                        data={getTransactinTypeOptions()}
                        isRequired={true}
                        noOptionsMessage={getNoOptionMessage()}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <MySelect
                        formState={formState}
                        register={register}
                        field={"transactionReason"}
                        placeholder={"Seleccionar motivo ..."}
                        label={"Motivo de la transacción"}
                        control={control}
                        data={getTransactinReasonOptions()}
                        isRequired={true}
                        noOptionsMessage={getNoOptionMessage()}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"affectedAmount"}
                        type={"number"}
                        placeholder={"Cantidad afectada"}
                        label={"Cantidad afectada"}
                      />
                    </GridItem>
                  </Grid>

                  <Stack
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
                      {!isEditing ? "Guardar" : "Actualizar"}
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

export default InventoryTransactionAddEditForm
