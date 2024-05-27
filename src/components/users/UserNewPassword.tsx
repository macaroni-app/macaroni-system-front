import { useNavigate, useParams } from "react-router-dom"

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
import { useForm } from "react-hook-form"
import { useChangePassword } from "../../hooks/useChangePassword"
import { useMessage } from "../../hooks/useMessage"
import { useError } from "../../hooks/useError"

// types
import { IUserLessRelated } from "./types"
import { userResetPasswordSchema } from "./userSchema"

import { RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import { useState } from "react"

const UserNewPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { userId } = useParams()

  const { changePassword } = useChangePassword()

  const navigate = useNavigate()

  const { throwError } = useError()

  const { showMessage } = useMessage()

  const onCancelOperation = () => {
    navigate(`/users/${userId}/details`)
  }

  const onSubmit = async (user: IUserLessRelated) => {
    setIsLoading(true)
    try {
      if (userId && user.password === user.confirmPassword) {
        await changePassword({ userId, userToUpdate: { ...user } })

        showMessage(
          RECORD_UPDATED,
          AlertStatus.Success,
          AlertColorScheme.Purple
        )

        navigate(`/users/${userId}/details`)
      } else {
        showMessage(
          "Las contraseñas no coinciden",
          AlertStatus.Error,
          AlertColorScheme.Red
        )
      }
    } catch (error: unknown) {
      throwError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const { register, formState, handleSubmit } = useForm<IUserLessRelated>({
    resolver: zodResolver(userResetPasswordSchema),
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
                  Nueva contraseña
                </Heading>
                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                  <Grid mb={4}>
                    <GridItem>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"password"}
                        type={"password"}
                        placeholder={"Nueva contraseña"}
                        label={"Nueva contraseña"}
                      />
                    </GridItem>
                  </Grid>
                  <Grid mb={4}>
                    <GridItem>
                      <MyInput
                        register={register}
                        formState={formState}
                        field={"confirmPassword"}
                        type={"password"}
                        placeholder={"Confirmar contraseña"}
                        label={"Confirmar contraseña"}
                      />
                    </GridItem>
                  </Grid>

                  <Stack
                    spacing={3}
                    direction={{ base: "column", md: "row" }}
                    justifyContent={"end"}
                  >
                    <Button type="submit" colorScheme="purple" variant="solid">
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

export default UserNewPasswordForm
