// libs
import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useLocation } from "react-router-dom"

// schema
import { userSchema } from "./userSchema"

// types
import { Credentials } from "../../services/types"
import { IUserContext } from "../../context/types"

// services
import loginService from "../../services/login"

// custom hooks
import { useAuthContext } from "../../hooks/useAuthContext"

import {
  Grid,
  GridItem,
  Button,
  Card,
  CardBody,
  // Image,
  FormLabel,
  FormControl,
  // FormErrorMessage,
  Input,
  Text,
  VStack,
  StackDivider,
  InputGroup,
  // InputRightElement,
  // IconButton,
  CardHeader,
  Heading,
} from "@chakra-ui/react"
import { jwtDecode } from "jwt-decode"

// import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"

interface UserPayload {
  email: string
  exp: number
  firstName: string
  iat: number
  id: string
  lastName: string
  roles: number[]
}

const Login = (): JSX.Element => {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"
  const { setAuth } = useAuthContext() as IUserContext
  const [show, setShow] = useState(false)
  // const handleClick = () => setShow(!show)
  const { register, handleSubmit } = useForm<Credentials>({
    resolver: zodResolver(userSchema),
  })

  const onSubmit: SubmitHandler<Credentials> = async (credentials) => {
    try {
      const response = await loginService.login({ ...credentials })
      const accessToken = response?.data?.accessToken

      const decoded = jwtDecode(accessToken) as UserPayload

      const roles = decoded?.roles as number[]

      setAuth({
        accessToken,
        roles,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
      })
      navigate(from, { replace: true })
    } catch (error) {
      // if (!error?.response) {
      //   showMessage("Error del servidor", "error", "red")
      // } else if (error?.response?.status === 400) {
      //   showMessage("Campos incompletos", "error", "red")
      // } else if (error.response?.status === 404) {
      //   showMessage("Credenciales incorrectas", "error", "red")
      // } else {
      //   showMessage("Falló el inicio de sesión", "error", "red")
      // }
    } finally {
      // formik.resetForm({ email: "", password: "", isLoading: false })
    }
  }

  return (
    <>
      <Grid
        templateColumns="repeat(12, 1fr)"
        justifyContent={"center"}
        alignContent={"center"}
        h={"100vh"}
      >
        <GridItem
          colSpan={{ base: 10, sm: 8, md: 6 }}
          colStart={{ base: 2, sm: 3, md: 4 }}
        >
          <Card mb={3} variant="outline">
            <CardHeader textAlign={"center"}>
              <Heading size="md">Inicio de sesión</Heading>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl
                    // isInvalid={formik.touched.email && formik.errors.email}
                    >
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input
                        type="email"
                        id="email"
                        placeholder="Ingresá tu email"
                        required
                        {...register("email")}
                      />
                      {/* {formik.touched.email && formik.errors.email && (
                        <FormErrorMessage>
                          {formik.errors.email}
                        </FormErrorMessage>
                      )} */}
                    </FormControl>
                  </GridItem>
                </Grid>
                <Grid mb={4}>
                  <GridItem>
                    <FormControl
                    // isInvalid={
                    //   formik.touched.password && formik.errors.password
                    // }
                    >
                      <FormLabel htmlFor="password">Contraseña</FormLabel>
                      <InputGroup size="md">
                        <Input
                          type={show ? "text" : "password"}
                          id="password"
                          placeholder="Ingresá tu contraseña"
                          required
                          {...register("password")}
                        />
                        {/* <InputRightElement width="2.5rem">
                          <IconButton
                            colorScheme="blue"
                            variant={"link"}
                            icon={show ? <ViewOffIcon /> : <ViewIcon />}
                            isRound={true}
                            size={"lg"}
                            onClick={handleClick}
                          />
                        </InputRightElement> */}
                      </InputGroup>
                      {/* {formik.touched.password && formik.errors.password && (
                        <FormErrorMessage>
                          {formik.errors.password}
                        </FormErrorMessage>
                      )} */}
                    </FormControl>
                  </GridItem>
                </Grid>

                <VStack
                  divider={<StackDivider borderColor="gray.200" />}
                  spacing={3}
                  align="stretch"
                >
                  <Button
                    // isLoading={formik.values.isLoading}
                    type="submit"
                    colorScheme="blue"
                    variant="solid"
                  >
                    Iniciar sesión
                  </Button>

                  {/* <Button
                      colorScheme="blue"
                      variant="link"
                      onClick={() => handleRecoverPassword()}
                    >
                      ¿Olvidaste tu clave?
                    </Button> */}
                </VStack>
              </form>
            </CardBody>
          </Card>
          {/* <Card variant="outline">
            <CardBody>
              <Text>
                ¿No tenes cuenta?{" "}
                <Button
                  colorScheme="blue"
                  variant="link"
                  onClick={() => console.log("hello")}
                >
                  Crear una cuenta
                </Button>
              </Text>
            </CardBody>
          </Card> */}
        </GridItem>
      </Grid>
    </>
  )
}

export default Login
