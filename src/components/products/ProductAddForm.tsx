// libs
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// types
import { IProductComplete } from "./types"

import { productSchema } from "./productSchema"

import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  Heading,
  FormControl,
  Stack,
  Flex,
  SimpleGrid,
  IconButton,
  Divider,
} from "@chakra-ui/react"

import { DeleteIcon } from "@chakra-ui/icons"

// components
import Loading from "../common/Loading"
import MyInput from "../ui/inputs/MyInput"
import MySelect from "../ui/inputs/MySelect"
import { ICategory } from "../categories/types"
import { IProductTypeType } from "../productTypes/types"
import { IAsset } from "../assets/types"

interface Props {
  onSubmit: SubmitHandler<IProductComplete>
  onCancelOperation: () => void
  productToUpdate?: IProductComplete
  categories?: ICategory[]
  productTypes?: IProductTypeType[]
  assets?: IAsset[]
  isLoading: boolean
}

const ProductFormAdd = ({
  onSubmit,
  onCancelOperation,
  productToUpdate,
  isLoading,
  categories,
  productTypes,
  assets,
}: Props) => {
  const { register, formState, handleSubmit, control, watch } =
    useForm<IProductComplete>({
      resolver: zodResolver(productSchema),
      defaultValues: {
        name: "",
        costPrice: undefined,
        wholesalePrice: undefined,
        retailsalePrice: undefined,
        productItems: [{ asset: "", quantity: 1 }],
      },
      values: {
        name: productToUpdate?.name || "",
        costPrice: productToUpdate?.costPrice || undefined,
        wholesalePrice: productToUpdate?.wholesalePrice || undefined,
        retailsalePrice: productToUpdate?.retailsalePrice || undefined,
        productItems: [{ asset: "", quantity: 1 }],
      },
    })

  // suscripción para los fields
  watch()

  const { fields, remove, append } = useFieldArray({
    name: "productItems",
    control,
  })

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <Grid templateColumns={{ base: "repeat(12, 1fr)" }} mt={5} mb={10}>
          <GridItem colSpan={{ base: 10, md: 8 }} colStart={{ base: 2, md: 3 }}>
            <Card mb={10} variant="outline">
              <CardBody>
                <Heading mb={3} textAlign="center" size="lg">
                  Nuevo producto:
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
                  </Grid>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
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

                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
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

                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MySelect
                        formState={formState}
                        register={register}
                        field={"productType"}
                        placeholder={"Buscar tipo de producto ..."}
                        label={"Tipo de producto"}
                        control={control}
                        data={productTypes}
                        isRequired={true}
                      />
                    </GridItem>
                  </Grid>

                  <Grid mb={4}>
                    <GridItem>
                      <FormControl>
                        <Divider orientation="horizontal" />
                      </FormControl>
                    </GridItem>
                  </Grid>

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
                                    field={`productItems.${index}.asset`}
                                    register={register}
                                    control={control}
                                    formState={formState}
                                    label="Insumo"
                                    placeholder="Buscar insumo"
                                    data={assets}
                                    isDisabled={false}
                                    isRequired={true}
                                  />
                                  <MyInput
                                    formState={formState}
                                    register={register}
                                    field={`productItems.${index}.quantity`}
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
                    onClick={() => append({ asset: "", quantity: 1 })}
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

export default ProductFormAdd
