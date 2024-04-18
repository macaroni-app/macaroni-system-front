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
import { IInventoryFullRelated, IInventoryLessRelated } from "./types"
import { IAssetFullCategory } from "../assets/types"
import { inventorySchema } from "./inventorySchema"

interface Props {
  onSubmit: SubmitHandler<IInventoryLessRelated>
  onCancelOperation: () => void
  inventoryToUpdate?: IInventoryFullRelated
  isEditing: boolean
  isLoading: boolean
  assets: IAssetFullCategory[]
}

const InventoryAddEditForm = (props: Props) => {
  const {
    onSubmit,
    onCancelOperation,
    inventoryToUpdate,
    isEditing,
    isLoading,
    assets,
  } = props

  const { register, formState, handleSubmit, control } =
    useForm<IInventoryLessRelated>({
      resolver: zodResolver(inventorySchema),
      values: {
        asset: inventoryToUpdate?.asset?._id,
        quantityAvailable: inventoryToUpdate?.quantityAvailable || undefined,
      },
    })

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
                  {!isEditing ? "Nuevo inventario" : "Modificar inventario"}
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
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"quantityAvailable"}
                        type={"number"}
                        placeholder={"Cantidad disponible"}
                        label={"Cantidad disponible"}
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

export default InventoryAddEditForm
