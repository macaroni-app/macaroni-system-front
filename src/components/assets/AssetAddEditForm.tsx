// libs
import { zodResolver } from "@hookform/resolvers/zod"

// custom hook
import { SubmitHandler, useForm } from "react-hook-form"

// types
import { IAssetLessCategory, IAssetFullCategory } from "./types"
import { ICategory } from "../categories/types"

// schemas
import { assetSchema } from "./assetSchema"

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
import MySelect from "../ui/inputs/MySelect"
import Loading from "../common/Loading"

interface Props {
  onSubmit: SubmitHandler<IAssetLessCategory>
  onCancelOperation: () => void
  assetToUpdate?: IAssetFullCategory
  categories?: ICategory[]
  isEditing: boolean
  isLoading: boolean
}

const AssetAddEditForm = (props: Props) => {
  const {
    onSubmit,
    onCancelOperation,
    assetToUpdate,
    isEditing,
    isLoading,
    categories,
  } = props

  const { register, formState, handleSubmit, control } =
    useForm<IAssetLessCategory>({
      resolver: zodResolver(assetSchema),
      values: {
        name: assetToUpdate?.name,
        category: assetToUpdate?.category?._id,
        costPrice: assetToUpdate?.costPrice,
      },
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
                  {!isEditing ? "Nuevo insumo:" : "Modificar insumo:"}
                </Heading>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12 }}>
                      <MyInput
                        formState={formState}
                        register={register}
                        field={"name"}
                        type={"text"}
                        placeholder={"Nombre insumo"}
                        label={"Nombre"}
                      />
                    </GridItem>

                    <GridItem colSpan={{ base: 12 }}>
                      <MySelect
                        formState={formState}
                        register={register}
                        field={"category"}
                        placeholder={"Buscar categoria ..."}
                        label={"Categoria"}
                        control={control}
                        data={categories}
                        isRequired={true}
                      />
                    </GridItem>

                    <GridItem colSpan={{ base: 12 }}>
                      <MyInput
                        formState={formState}
                        register={register}
                        field={"costPrice"}
                        type={"number"}
                        placeholder={"Precio de costo"}
                        label={"Precio de costo"}
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

export default AssetAddEditForm
