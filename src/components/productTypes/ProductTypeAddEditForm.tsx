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
import { IProductTypeType } from "./types"
import { productTypeSchema } from "./productTypeSchema"

interface Props {
  onSubmit: SubmitHandler<IProductTypeType>
  onCancelOperation: () => void
  productTypeToUpdate?: IProductTypeType
  isEditing: boolean
  isLoading: boolean
}

const ProductTypeAddEditForm = (props: Props) => {
  const {
    onSubmit,
    onCancelOperation,
    productTypeToUpdate,
    isEditing,
    isLoading,
  } = props

  const { register, formState, handleSubmit } = useForm<IProductTypeType>({
    resolver: zodResolver(productTypeSchema),
    values: {
      name: productTypeToUpdate?.name,
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
                    ? "Nuevo tipo de producto"
                    : "Modificar tipo de producto"}
                </Heading>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Grid mb={4}>
                    <GridItem>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"name"}
                        type={"text"}
                        placeholder={"Nombre del tipo de producto"}
                        label={"Nombre"}
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

export default ProductTypeAddEditForm
