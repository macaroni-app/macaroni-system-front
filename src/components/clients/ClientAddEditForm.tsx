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
import { IClient } from "./types"
import { clientSchema } from "./clientSchema"
import MySelect from "../ui/inputs/MySelect"

interface Props {
  onSubmit: SubmitHandler<IClient>
  onCancelOperation: () => void
  clientToUpdate?: IClient
  documentTypes?: { id?: string, name?: string }[]
  condicionsIvaReceptor?: { id?: string, name?: string }[]
  isEditing: boolean
  isLoading: boolean
}

const ClientAddEditForm = (props: Props) => {
  const { onSubmit, onCancelOperation, clientToUpdate, isEditing, isLoading, documentTypes, condicionsIvaReceptor } =
    props

  const { register, formState, handleSubmit, control } = useForm<IClient>({
    resolver: zodResolver(clientSchema),
    values: {
      name: clientToUpdate?.name,
      condicionIVAReceptorId: clientToUpdate?.condicionIVAReceptorId,
      documentNumber: clientToUpdate?.documentNumber,
      documentType: clientToUpdate?.documentType,
      address: clientToUpdate?.address
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
                  {!isEditing ? "Nuevo cliente" : "Modificar cliente"}
                </Heading>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12, md: 6 }} >
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"name"}
                        type={"text"}
                        placeholder={"Nombre del cliente"}
                        label={"Nombre"}
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"documentNumber"}
                        type={"number"}
                        placeholder={"Número de documento "}
                        label={"Número de documento"}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MySelect
                        formState={formState}
                        register={register}
                        field={"documentType"}
                        placeholder={"Buscar tipo de documento ..."}
                        label={"Tipo de documento"}
                        control={control}
                        data={documentTypes}
                        objectName="documentType"
                        isRequired={true}
                        noOptionsMessage="No hay datos"
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MySelect
                        formState={formState}
                        register={register}
                        field={"condicionIVAReceptorId"}
                        placeholder={"Buscar condicion de iva ..."}
                        label={"Condición IVA receptor"}
                        control={control}
                        data={condicionsIvaReceptor}
                        objectName="condicionIVAReceptorId"
                        isRequired={true}
                        noOptionsMessage="No hay datos"
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
