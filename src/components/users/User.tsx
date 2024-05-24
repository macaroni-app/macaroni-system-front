import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Text,
  Flex,
  IconButton,
  Popover,
  PopoverTrigger,
  Button,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  VStack,
  useDisclosure,
  Badge,
} from "@chakra-ui/react"

import CustomModal from "../common/CustomModal"

import { useNavigate } from "react-router-dom"

import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons"
import { useState } from "react"

// import { useDeleteClient } from "../../hooks/useDeleteClient"
// import { useChangeIsActiveClient } from "../../hooks/useChangeIsActiveClient"
import { useMessage } from "../../hooks/useMessage"

import { IRole, IUser } from "./types"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

import { useCheckRole } from "../../hooks/useCheckRole"

import ProfileBase from "../common/permissions"
import { useChangeIsActiveUser } from "../../hooks/useChangeIsActiveUser"
import { useDeleteUser } from "../../hooks/useDeleteUser"

interface Props {
  user: IUser
}

const User = ({ user }: Props) => {
  const navigate = useNavigate()

  const { checkRole } = useCheckRole()

  const [isLoading, setIsLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const { deleteUser } = useDeleteUser()
  const { showMessage } = useMessage()
  const { changeIsActiveUser } = useChangeIsActiveUser()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleEdit = () => {
    navigate(`${user._id}/edit`)
  }

  const handleChangeIsActive = async (isActive: boolean) => {
    setIsLoading(true)

    if (user === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }

    let response = undefined

    if (user !== undefined && user._id !== undefined) {
      response = await changeIsActiveUser({
        userId: user._id,
        isActive,
      })
    }

    if (response?.isUpdated) {
      showMessage(
        isActive ? "Usuario activado." : "Usuario desactivado.",
        AlertStatus.Success,
        AlertColorScheme.Purple
      )
      setIsLoading(false)
      onClose()
    }

    if (!response?.isUpdated) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }

    setDeleteModal(false)
    navigate("/users")
  }

  const handleDelete = async () => {
    setIsLoading(true)

    if (user === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }

    let response = undefined

    if (user !== undefined && user._id !== undefined) {
      response = await deleteUser(user._id)
    }

    if (response?.isDeleted) {
      showMessage(
        "Usuario eliminado.",
        AlertStatus.Success,
        AlertColorScheme.Purple
      )
      setIsLoading(false)
    }

    if (!response?.isDeleted) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }
    setDeleteModal(false)
    navigate("/users")
  }

  const userRole = user.roles?.find((rol) => rol) as IRole

  return (
    <GridItem colSpan={5} mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Text noOfLines={1} fontSize="xl" align="start" mr={4}>
                  {user.firstName} - {user.lastName}
                </Text>
                <Badge
                  variant="subtle"
                  colorScheme={user?.isActive ? "green" : "red"}
                  alignSelf={"start"}
                >
                  {user?.isActive ? "Activo" : "Inactivo"}
                </Badge>
                <Text fontSize="xs" align="start">
                  Rol:{" "}
                  <Text fontWeight={"bold"} as={"span"}>
                    {userRole?.name}
                  </Text>
                </Text>
              </Flex>
            </GridItem>

            <GridItem colSpan={1} colStart={6}>
              <Flex direction="column" gap={2}>
                {checkRole(ProfileBase.users.viewActions) && (
                  <Popover placement="bottom-start">
                    <PopoverTrigger>
                      <IconButton
                        alignSelf="end"
                        variant={"link"}
                        colorScheme="blackAlpha"
                        size="md"
                        icon={
                          <>
                            <AddIcon boxSize="3" />
                            <ChevronDownIcon boxSize="4" />
                          </>
                        }
                        aria-label={""}
                      />
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent width="3xs">
                        <PopoverArrow />
                        <PopoverBody p={0}>
                          <VStack spacing={1} align="stretch">
                            {checkRole(ProfileBase.users.edit) && (
                              <Button
                                onClick={() => handleEdit()}
                                variant={"blue"}
                                colorScheme="blue"
                                justifyContent={"start"}
                                size="md"
                                _hover={{
                                  textDecoration: "none",
                                  color: "purple",
                                  bg: "purple.100",
                                }}
                              >
                                Editar
                              </Button>
                            )}
                            {checkRole(ProfileBase.users.deactivate) && (
                              <Button
                                onClick={() => {
                                  setDeleteModal(false)
                                  onOpen()
                                }}
                                variant={"blue"}
                                colorScheme="blue"
                                justifyContent={"start"}
                                size="md"
                                _hover={{
                                  textDecoration: "none",
                                  color: "purple",
                                  bg: "purple.100",
                                }}
                              >
                                {user.isActive ? "Desactivar" : "Activar"}
                              </Button>
                            )}
                            {checkRole(ProfileBase.users.delete) && (
                              <Button
                                onClick={() => {
                                  setDeleteModal(true)
                                  onOpen()
                                }}
                                variant={"blue"}
                                colorScheme="blue"
                                justifyContent={"start"}
                                size="md"
                                _hover={{
                                  textDecoration: "none",
                                  color: "purple",
                                  bg: "purple.100",
                                }}
                              >
                                Borrar
                              </Button>
                            )}
                          </VStack>
                        </PopoverBody>
                      </PopoverContent>
                    </Portal>
                  </Popover>
                )}
              </Flex>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
      <CustomModal
        deleteModal={deleteModal}
        handleChangeIsActive={handleChangeIsActive}
        handleDelete={handleDelete}
        isLoading={isLoading}
        isOpen={isOpen}
        model={user}
        modelName="Cliente"
        onClose={onClose}
        key={user._id}
      />
    </GridItem>
  )
}

export default User
