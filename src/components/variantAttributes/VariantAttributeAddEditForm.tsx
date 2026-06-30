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
import { IVariantAttribute } from "./types"
import { variantAttributeSchema } from "./variantAttributeSchema"

interface Props {
  onSubmit: SubmitHandler<IVariantAttribute>
  onCancelOperation: () => void
  variantAttributeToUpdate?: IVariantAttribute
  isEditing: boolean
  isLoading: boolean
}

const VariantAttributeAddEditForm = ({
  onSubmit,
  onCancelOperation,
  variantAttributeToUpdate,
  isEditing,
  isLoading,
}: Props) => {
  const { register, formState, handleSubmit } = useForm<IVariantAttribute>({
    resolver: zodResolver(variantAttributeSchema),
    values: {
      name: variantAttributeToUpdate?.name,
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
                    ? "Nuevo atributo de variante"
                    : "Modificar atributo de variante"}
                </Heading>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Grid mb={4}>
                    <GridItem>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"name"}
                        type={"text"}
                        placeholder={"Nombre del atributo"}
                        label={"Nombre"}
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

export default VariantAttributeAddEditForm
