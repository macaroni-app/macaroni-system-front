// libs
import { zodResolver } from "@hookform/resolvers/zod"

// custom hook
import { SubmitHandler, useForm } from "react-hook-form"

// types
import { IProduct } from "./types"

// schemas
import { productSchema } from "./productSchema"

import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
} from "@chakra-ui/react"

// components
import MyInput from "../ui/inputs/MyInput"
// import MySelect from "../ui/inputs/MySelect"
import Loading from "../common/Loading"

interface Props {
  onSubmit: SubmitHandler<IProduct>
  onCancelOperation: () => void
  productToUpdate?: IProduct
  isEditing: boolean
  isLoading: boolean
}

const ProductAddEditForm = (props: Props) => {
  const {
    onSubmit,
    onCancelOperation,
    productToUpdate,
    // categories,
    isEditing,
    isLoading,
  } = props

  const { register, formState, handleSubmit } = useForm<IProduct>({
    resolver: zodResolver(productSchema),
    defaultValues: { ...productToUpdate },
  })

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <Grid templateColumns="repeat(12, 1fr)" mt={5} mb={10}>
          <GridItem
            colSpan={{ base: 10, sm: 8, md: 8 }}
            colStart={{ base: 2, sm: 3, md: 3 }}
          >
            <Card mb={10} variant="outline">
              <CardBody>
                <Heading mb={3} textAlign="center" size="lg">
                  {!isEditing ? "Nuevo producto:" : "Modificar producto:"}
                </Heading>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MyInput
                        formState={formState}
                        register={register}
                        field={"name"}
                        type={"text"}
                        placeholder={"Nombre producto"}
                        label={"Nombre"}
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MyInput
                        formState={formState}
                        register={register}
                        field={"costPrice"}
                        type={"number"}
                        placeholder={"Precio de costo"}
                        label={"Precio de costo"}
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MyInput
                        formState={formState}
                        register={register}
                        field={"retailsalePrice"}
                        type={"number"}
                        placeholder={"Precio por menor"}
                        label={"Precio por menor"}
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MyInput
                        formState={formState}
                        register={register}
                        field={"wholesalePrice"}
                        type={"number"}
                        placeholder={"Precio por mayor"}
                        label={"Precio por mayor"}
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

export default ProductAddEditForm
