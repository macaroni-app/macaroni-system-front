import {
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  Heading,
  Stack,
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import Loading from "../common/Loading"
import MyInput from "../ui/inputs/MyInput"
import MySelect from "../ui/inputs/MySelect"
import { IVariantAttributeValue } from "./types"
import { variantAttributeValueSchema } from "./variantAttributeValueSchema"
import { IVariantAttribute } from "../variantAttributes/types"

interface Props {
  onSubmit: SubmitHandler<IVariantAttributeValue>
  onCancelOperation: () => void
  variantAttributeValueToUpdate?: IVariantAttributeValue
  attributes?: IVariantAttribute[]
  isEditing: boolean
  isLoading: boolean
}

const VariantAttributeValueAddEditForm = ({
  onSubmit,
  onCancelOperation,
  variantAttributeValueToUpdate,
  attributes,
  isEditing,
  isLoading,
}: Props) => {
  const { register, formState, handleSubmit, control } =
    useForm<IVariantAttributeValue>({
      resolver: zodResolver(variantAttributeValueSchema),
      values: {
        name: variantAttributeValueToUpdate?.name,
        attribute:
          typeof variantAttributeValueToUpdate?.attribute === "string"
            ? variantAttributeValueToUpdate.attribute
            : variantAttributeValueToUpdate?.attribute?._id,
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
                  {!isEditing
                    ? "Nuevo valor de variante"
                    : "Modificar valor de variante"}
                </Heading>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Grid mb={4}>
                    <GridItem>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"name"}
                        type={"text"}
                        placeholder={"Nombre del valor"}
                        label={"Nombre"}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <MySelect
                        formState={formState}
                        register={register}
                        field={"attribute"}
                        placeholder={"Buscar atributo ..."}
                        label={"Atributo"}
                        control={control}
                        data={attributes as never}
                        isRequired={true}
                        noOptionsMessage="No hay datos"
                      />
                    </GridItem>
                  </Grid>

                  <Stack
                    spacing={3}
                    direction={{ base: "column", md: "row" }}
                    justifyContent={"end"}
                  >
                    <Button type="submit" colorScheme="purple" variant="solid">
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

export default VariantAttributeValueAddEditForm
