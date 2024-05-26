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
import { IUserLessRelated, IUserFullRelated } from "./types"
import { userSchema } from "./userSchema"
import { IRoleType } from "../roles/types"

interface Props {
  onSubmit: SubmitHandler<IUserLessRelated>
  onCancelOperation: () => void
  userToUpdate?: IUserFullRelated
  roles?: IRoleType[]
  isEditing: boolean
  isLoading: boolean
}

const UserAddEditForm = (props: Props) => {
  const {
    onSubmit,
    onCancelOperation,
    userToUpdate,
    isEditing,
    isLoading,
    roles,
  } = props

  const { register, formState, handleSubmit, control } =
    useForm<IUserLessRelated>({
      resolver: zodResolver(userSchema),
      values: {
        firstName: userToUpdate?.firstName,
        lastName: userToUpdate?.lastName,
        // email: userToUpdate?.email,
        role: userToUpdate?.role?._id,
        // password: "",
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
                  {!isEditing ? "Nuevo usuario" : "Modificar usuario"}
                </Heading>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Grid mb={4}>
                    <GridItem>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"firstName"}
                        type={"text"}
                        placeholder={"Nombre"}
                        label={"Nombre"}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"lastName"}
                        type={"text"}
                        placeholder={"Apellido"}
                        label={"Apellido"}
                      />
                    </GridItem>
                  </Grid>
                  {!isEditing && (
                    <>
                      <Grid mb={4}>
                        <GridItem>
                          <MyInput
                            register={register}
                            formState={formState}
                            field={"email"}
                            type={"email"}
                            placeholder={"Email"}
                            label={"Email"}
                          />
                        </GridItem>
                      </Grid>
                      <Grid mb={4}>
                        <GridItem>
                          <MyInput
                            register={register}
                            formState={formState}
                            field={"password"}
                            type={"password"}
                            placeholder={"Nueva contraseña"}
                            label={"Contraseña"}
                          />
                        </GridItem>
                      </Grid>
                    </>
                  )}
                  <GridItem mb={4}>
                    <MySelect
                      formState={formState}
                      register={register}
                      field={"role"}
                      placeholder={"Buscar rol ..."}
                      label={"Rol"}
                      control={control}
                      data={roles}
                      isRequired={true}
                      noOptionsMessage="No hay datos"
                    />
                  </GridItem>

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

export default UserAddEditForm
