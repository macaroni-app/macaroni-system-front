import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Text,
  Flex,
  Button,
  Spacer,
  Divider,
  Box,
  Stack,
  Skeleton,
  Badge,
} from "@chakra-ui/react"

import { useNavigate, useParams } from "react-router-dom"

// types
import { IUserFullRelated } from "./types"

import { ChevronLeftIcon, EditIcon } from "@chakra-ui/icons"

// import { format } from "date-fns"
// import { es } from "date-fns/locale"

// custom hooks
import { useUsers } from "../../hooks/useUsers"
import { useCheckRole } from "../../hooks/useCheckRole"

import ProfileBase from "../common/permissions"

const UserDetails = () => {
  const { userId } = useParams()

  const { checkRole } = useCheckRole()

  const queryUsers = useUsers({})

  const user = queryUsers.data?.filter(
    (user) => user._id === userId
  )[0] as IUserFullRelated

  const navigate = useNavigate()

  const handleGoBack = () => {
    if (checkRole(ProfileBase.users.view)) {
      navigate("/users")
    } else {
      navigate("/")
    }
  }

  const handleEditPassword = () => {
    navigate(`/users/${userId}/new-password`)
  }

  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" gap={1}>
        <GridItem
          mt={1}
          colSpan={{ base: 10, lg: 8 }}
          colStart={{ base: 2, lg: 3 }}
        >
          <Card variant="outline" mt={5} mb={3}>
            <CardBody>
              <Flex>
                <Button
                  onClick={() => handleGoBack()}
                  colorScheme="blue"
                  variant="outline"
                >
                  <ChevronLeftIcon boxSize={4} me={1} />
                  Volver
                </Button>
                <Spacer />
                <Button
                  onClick={() => handleEditPassword()}
                  colorScheme="purple"
                  variant="solid"
                >
                  <EditIcon boxSize={3} me={2} />
                  Nueva contraseña
                </Button>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>
        {queryUsers?.isLoading && (
          <GridItem
            mt={1}
            colSpan={{ base: 10, lg: 8 }}
            colStart={{ base: 2, lg: 3 }}
          >
            <Card variant="outline">
              <CardBody>
                <Grid
                  templateColumns="repeat(6, 1fr)"
                  gap={2}
                  alignItems="center"
                >
                  <GridItem colSpan={6}>
                    <Stack>
                      <Skeleton height="50px" />
                      <Box padding="3">
                        <Divider />
                      </Box>
                      <Skeleton height="30px" />
                      <Skeleton height="30px" />
                      <Skeleton height="30px" />
                      <Skeleton height="30px" />
                      <Skeleton height="30px" />
                    </Stack>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        )}

        {!queryUsers?.isLoading && (
          <GridItem
            mt={1}
            colSpan={{ base: 10, lg: 8 }}
            colStart={{ base: 2, lg: 3 }}
          >
            <Card variant="outline">
              <CardBody>
                <Grid
                  templateColumns="repeat(6, 1fr)"
                  gap={2}
                  alignItems="center"
                >
                  <GridItem colSpan={6}>
                    <Text fontSize={"x-large"} mb={3}>
                      {user.firstName} {user.lastName}
                    </Text>
                    <Divider mb={3} />
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Nombre: </Text>
                      <Text as="b" fontSize="lg">
                        {user?.firstName}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Apellido: </Text>
                      <Text as="b" fontSize="lg">
                        {user?.lastName}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Email: </Text>
                      <Text as="b" fontSize="lg">
                        {user?.email}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Estado: </Text>
                      <Text as="b" fontSize="lg">
                        {user?.isActive ? (
                          <Badge colorScheme="green">Activo</Badge>
                        ) : (
                          <Badge colorScheme="red">Inactivo</Badge>
                        )}
                      </Text>
                    </Flex>
                    <Flex
                      mb={2}
                      direction="row"
                      justifyContent={"space-between"}
                    >
                      <Text fontSize="lg">Rol: </Text>
                      <Text as="b" fontSize="lg">
                        <Badge colorScheme="purple">{user?.role?.name}</Badge>
                      </Text>
                    </Flex>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        )}
      </Grid>
    </>
  )
}

export default UserDetails
