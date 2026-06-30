import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import Select from "react-select"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { IAssetFullCategory } from "../assets/types"
import Loading from "../common/Loading"
import MyInput from "../ui/inputs/MyInput"
import MySelect from "../ui/inputs/MySelect"
import { IVariantAttributeValue } from "../variantAttributeValues/types"
import { IAssetVariant } from "./types"
import { assetVariantSchema } from "./assetVariantSchema"

interface Props {
  onSubmit: SubmitHandler<IAssetVariant>
  onCancelOperation: () => void
  assetVariantToUpdate?: IAssetVariant
  assets?: IAssetFullCategory[]
  values?: IVariantAttributeValue[]
  isEditing: boolean
  isLoading: boolean
}

const AssetVariantAddEditForm = ({
  onSubmit,
  onCancelOperation,
  assetVariantToUpdate,
  assets,
  values,
  isEditing,
  isLoading,
}: Props) => {
  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : undefined

  const { register, formState, handleSubmit, control } =
    useForm<IAssetVariant>({
      resolver: zodResolver(assetVariantSchema),
      defaultValues: {
        name: assetVariantToUpdate?.name,
        baseAsset:
          typeof assetVariantToUpdate?.baseAsset === "string"
            ? assetVariantToUpdate.baseAsset
            : assetVariantToUpdate?.baseAsset?._id,
        values: (assetVariantToUpdate?.values ?? []).map((value) =>
          typeof value === "string" ? value : String(value._id),
        ),
        sku: assetVariantToUpdate?.sku,
        costPrice: assetVariantToUpdate?.costPrice,
      },
      values: {
        name: assetVariantToUpdate?.name,
        baseAsset:
          typeof assetVariantToUpdate?.baseAsset === "string"
            ? assetVariantToUpdate.baseAsset
            : assetVariantToUpdate?.baseAsset?._id,
        values: (assetVariantToUpdate?.values ?? []).map((value) =>
          typeof value === "string" ? value : String(value._id),
        ),
        sku: assetVariantToUpdate?.sku,
        costPrice: assetVariantToUpdate?.costPrice,
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
                    ? "Nueva variante de insumo"
                    : "Modificar variante de insumo"}
                </Heading>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Grid mb={4}>
                    <GridItem>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"name"}
                        type={"text"}
                        placeholder={"Nombre visible de la variante"}
                        label={"Nombre"}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <MySelect
                        formState={formState}
                        register={register}
                        field={"baseAsset"}
                        placeholder={"Buscar insumo base ..."}
                        label={"Insumo base"}
                        control={control}
                        data={assets as never}
                        isRequired={true}
                        noOptionsMessage="No hay datos"
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4} templateColumns="repeat(12, 1fr)" gap={4}>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"sku"}
                        type={"text"}
                        placeholder={"SKU opcional"}
                        label={"SKU"}
                      />
                    </GridItem>
                    <GridItem colSpan={{ base: 12, md: 6 }}>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"costPrice"}
                        type={"number"}
                        placeholder={"Costo opcional"}
                        label={"Costo"}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Valores de variante</FormLabel>
                        <Text fontSize="sm" color="gray.600" mb={2}>
                          Podés combinar uno o más valores, por ejemplo sabor y color.
                        </Text>
                        <Controller
                          control={control}
                          name="values"
                          render={({ field }) => (
                            <Select
                              isMulti
                              placeholder="Seleccionar valores de variante"
                              options={values?.map((value) => ({
                                value: String(value._id),
                                label: `${value.name}${
                                  typeof value.attribute === "string"
                                    ? ""
                                    : value.attribute?.name
                                      ? ` (${value.attribute.name})`
                                      : ""
                                }`,
                              }))}
                              value={(values ?? [])
                                .filter((value) =>
                                  (field.value ?? []).includes(String(value._id)),
                                )
                                .map((value) => ({
                                  value: String(value._id),
                                  label: `${value.name}${
                                    typeof value.attribute === "string"
                                      ? ""
                                      : value.attribute?.name
                                        ? ` (${value.attribute.name})`
                                        : ""
                                  }`,
                                }))}
                              menuPortalTarget={menuPortalTarget}
                              menuPosition="fixed"
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                              onChange={(selectedOptions) => {
                                field.onChange(
                                  selectedOptions.map((option) => option.value),
                                )
                              }}
                            />
                          )}
                        />
                      </FormControl>
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

export default AssetVariantAddEditForm
