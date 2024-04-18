import { useState } from "react"

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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"

import { useNavigate } from "react-router-dom"

import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons"

import { useDeleteInventory } from "../../hooks/useDeleteInventory"
import { useMessage } from "../../hooks/useMessage"

import { IInventoryFullRelated } from "./types"

import { AlertColorScheme, AlertStatus } from "../../utils/enums"

interface Props {
  inventory: IInventoryFullRelated
}

const Inventory = ({ inventory }: Props) => {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  const { deleteInventory } = useDeleteInventory()

  const { showMessage } = useMessage()

  const handleEdit = () => {
    navigate(`${inventory._id}/edit`)
  }

  const handleDelete = async () => {
    setIsLoading(true)

    if (inventory === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }

    let response = undefined

    if (inventory !== undefined && inventory._id !== undefined) {
      response = await deleteInventory(inventory._id)
    }

    if (response?.isDeleted) {
      showMessage(
        "Inventario eliminado.",
        AlertStatus.Success,
        AlertColorScheme.Purple
      )
      setIsLoading(false)
    }

    if (!response?.isDeleted) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }
    navigate("/inventories")
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <GridItem colSpan={5} mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Text noOfLines={1} fontSize="xl" align="start" mr={4}>
                  {inventory?.asset?.name}
                </Text>
                <Text fontSize="xs" align="start">
                  Cantidad disponible:{" "}
                  <Text fontWeight={"bold"} as={"span"}>
                    {inventory.quantityAvailable}
                  </Text>
                </Text>
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
                      aria-label="some"
                      size="md"
                      icon={
                        <>
                          <AddIcon boxSize="3" />
                          <ChevronDownIcon boxSize="4" />
                        </>
                      }
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
                            onClick={onOpen}
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
      <Modal
        closeOnOverlayClick={false}
        isCentered
        size={{ base: "xs", md: "lg" }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Borrar insumo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              ¿Estás seguro de eliminar el insumo{" "}
              <Text as={"b"}>{inventory?.asset?.name}</Text>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isLoading}
              colorScheme="red"
              mr={3}
              onClick={() => handleDelete()}
            >
              Borrar
            </Button>
            <Button onClick={onClose} variant="ghost">
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </GridItem>
  )
}

export default Inventory
