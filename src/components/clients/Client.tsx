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

import { useDeleteClient } from "../../hooks/useDeleteClient"
import { useChangeIsActiveClient } from "../../hooks/useChangeIsActiveClient"
import { useMessage } from "../../hooks/useMessage"

import { IClient } from "./types"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

interface Props {
  client: IClient
}

const Client = ({ client }: Props) => {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const { deleteClient } = useDeleteClient()
  const { showMessage } = useMessage()
  const { changeIsActiveClient } = useChangeIsActiveClient()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleEdit = () => {
    navigate(`${client._id}/edit`)
  }

  const handleChangeIsActive = async (isActive: boolean) => {
    setIsLoading(true)

    if (client === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }

    let response = undefined

    if (client !== undefined && client._id !== undefined) {
      response = await changeIsActiveClient({
        clientId: client._id,
        isActive,
      })
    }

    if (response?.isUpdated) {
      showMessage(
        isActive ? "Cliente activado." : "Cliente desactivado.",
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
    navigate("/clients")
  }

  const handleDelete = async () => {
    setIsLoading(true)

    if (client === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }

    let response = undefined

    if (client !== undefined && client._id !== undefined) {
      response = await deleteClient(client._id)
    }

    if (response?.isDeleted) {
      showMessage(
        "Cliente eliminado.",
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
    navigate("/clients")
  }

  return (
    <GridItem colSpan={5} mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Text noOfLines={1} fontSize="xl" align="start" mr={4}>
                  {client.name}
                </Text>
                <Badge
                  variant="subtle"
                  colorScheme={client?.isActive ? "green" : "red"}
                  alignSelf={"start"}
                >
                  {client?.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </Flex>
            </GridItem>

            <GridItem colSpan={1} colStart={6}>
              <Flex direction="column" gap={2}>
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
                            {client.isActive ? "Desactivar" : "Activar"}
                          </Button>
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
                        </VStack>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
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
        model={client}
        modelName="Cliente"
        onClose={onClose}
        key={client._id}
      />
    </GridItem>
  )
}

export default Client
