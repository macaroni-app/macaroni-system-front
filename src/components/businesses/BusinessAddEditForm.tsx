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

// libs
import { zodResolver } from "@hookform/resolvers/zod"

// custom hook
import { SubmitHandler, useForm } from "react-hook-form"
import { IBusiness } from "./types"
import { businessSchema } from "./businessSchema"

interface Props {
  onSubmit: SubmitHandler<IBusiness>
  onCancelOperation: () => void
  businessToUpdate?: IBusiness
  isEditing: boolean
  isLoading: boolean
}

const ClientAddEditForm = (props: Props) => {
  const { onSubmit, onCancelOperation, businessToUpdate, isEditing, isLoading } =
    props

  const { register, formState, handleSubmit } = useForm<IBusiness>({
    resolver: zodResolver(businessSchema),
    values: {
      name: businessToUpdate?.name,
      cuit: businessToUpdate?.cuit,
      ivaCondition: businessToUpdate?.ivaCondition,
      address: businessToUpdate?.address
    },
  })

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <Grid templateColumns={{ base: "repeat(12, 1fr)" }} mt={5}>
          <GridItem colSpan={{ base: 10, md: 8 }} colStart={{ base: 2, md: 3 }}>
            <Card mb={3} variant="outline">
              <CardBody>
                <Heading mb={3} textAlign="center" size="lg">
                  {!isEditing ? "Nuevo negocio" : "Modificar negocio"}
                </Heading>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12, md: 6 }} >
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"name"}
                        type={"text"}
                        placeholder={"Nombre del negocio"}
                        label={"Nombre"}
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"cuit"}
                        type={"string"}
                        placeholder={"Número de cuit "}
                        label={"Número de cuit"}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12 }}>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"ivaCondition"}
                        type={"text"}
                        placeholder={"Condición frente al IVA"}
                        label={"Condición frente al IVA"}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12 }}>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"address"}
                        type={"text"}
                        placeholder={"Dirección del cliente"}
                        label={"Dirección"}
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
        </Grid >
      )}
    </>
  )
}

export default ClientAddEditForm
