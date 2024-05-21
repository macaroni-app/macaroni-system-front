import { useState } from "react"
import { useNavigate } from "react-router-dom"

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
  Badge,
} from "@chakra-ui/react"

import {
  ChevronDownIcon,
  AddIcon,
  TriangleUpIcon,
  TriangleDownIcon,
} from "@chakra-ui/icons"

import { format } from "date-fns"
import { es } from "date-fns/locale"

import { useDeleteInventoryTransaction } from "../../hooks/useDeleteInventoryTransaction"
import { useMessage } from "../../hooks/useMessage"
import { useCheckRole } from "../../hooks/useCheckRole"

import { IInventoryTransactionFullRelated } from "./types"

import { AlertColorScheme, AlertStatus } from "../../utils/enums"

import { ROLES } from "../common/roles"

interface Props {
  inventoryTransaction: IInventoryTransactionFullRelated
}

const InventoryTransaction = ({ inventoryTransaction }: Props) => {
  const navigate = useNavigate()

  const { checkRole } = useCheckRole()

  const [isLoading, setIsLoading] = useState(false)

  const { deleteInventoryTransaction } = useDeleteInventoryTransaction()

  const { showMessage } = useMessage()

  // const handleEdit = () => {
  //   navigate(`${inventoryTransaction._id}/edit`)
  // }

  const handleDelete = async () => {
    setIsLoading(true)

    if (inventoryTransaction === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }

    let response = undefined

    if (
      inventoryTransaction !== undefined &&
      inventoryTransaction._id !== undefined
    ) {
      response = await deleteInventoryTransaction(inventoryTransaction._id)
    }

    if (response?.isDeleted) {
      showMessage(
        "Transaction de inventario eliminado.",
        AlertStatus.Success,
        AlertColorScheme.Purple
      )
      setIsLoading(false)
    }

    if (!response?.isDeleted) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }
    navigate("/inventoryTransactions")
  }

  const getColorSchemeBaseOnTransactionType = (transactionType: string) => {
    return transactionType === "DOWN" ? "red" : "green"
  }

  const getLabelBaseOnTransactionType = (transactionReason: string) => {
    return transactionReason === "BUY"
      ? "Compra"
      : transactionReason === "SELL"
      ? "Venta"
      : transactionReason === "RETURN"
      ? "Devolución"
      : transactionReason === "ADJUSTMENT"
      ? "Ajuste"
      : transactionReason === "DONATION"
      ? "Donación"
      : transactionReason === "DEFEATED"
      ? "Vencido"
      : transactionReason === "LOSS"
      ? "Pérdida"
      : transactionReason === "INTERNAL_USAGE"
      ? "Uso interno"
      : "Otro"
  }

  const numberColumn = checkRole([ROLES.ADMIN]) ? 6 : 5

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <GridItem colSpan={5} mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid
            templateColumns={`repeat(${numberColumn}, 1fr)`}
            gap={2}
            alignItems="center"
          >
            <GridItem colSpan={{ base: 5, md: 1 }}>
              <Flex direction="column" gap={2}>
                <Text fontSize="lg" align="start" mr={2}>
                  {inventoryTransaction?.asset?.name}
                </Text>
                <Text display={{ md: "none" }}>
                  Cantidad afectada:{" "}
                  <Text as="b">{inventoryTransaction?.affectedAmount}</Text>
                </Text>
              </Flex>
            </GridItem>
            <GridItem display={{ base: "none", md: "block" }}>
              <Flex direction="column" gap={2} placeItems={"center"}>
                <Badge
                  variant={"subtle"}
                  colorScheme={getColorSchemeBaseOnTransactionType(
                    inventoryTransaction.transactionType !== undefined
                      ? inventoryTransaction.transactionType
                      : ""
                  )}
                >
                  {getLabelBaseOnTransactionType(
                    inventoryTransaction.transactionReason !== undefined
                      ? inventoryTransaction.transactionReason
                      : ""
                  )}
                  {inventoryTransaction.transactionType === "UP" && (
                    <TriangleUpIcon boxSize={3} ms={2} mb={1} />
                  )}
                  {inventoryTransaction.transactionType === "DOWN" && (
                    <TriangleDownIcon boxSize={3} ms={2} mb={1} />
                  )}
                </Badge>
              </Flex>
            </GridItem>
            <GridItem display={{ base: "none", md: "block" }}>
              <Flex direction="column" gap={2} placeItems={"center"}>
                <Text fontSize="xs" align="start">
                  {inventoryTransaction?.affectedAmount}
                </Text>
              </Flex>
            </GridItem>
            <GridItem display={{ base: "none", md: "block" }}>
              <Flex direction="column" gap={2} placeItems={"center"}>
                <Text fontSize="xs" align="start">
                  {inventoryTransaction?.createdBy?.firstName}{" "}
                  {inventoryTransaction?.createdBy?.lastName}
                </Text>
              </Flex>
            </GridItem>
            <GridItem display={{ base: "none", md: "block" }}>
              <Flex direction="column" gap={2} placeItems={"center"}>
                <Text color={"gray.500"} fontSize="xs" align="start">
                  {format(
                    new Date(
                      inventoryTransaction?.createdAt
                        ? inventoryTransaction?.createdAt
                        : ""
                    ),
                    "eeee dd yyyy",
                    {
                      locale: es,
                    }
                  )}
                </Text>
              </Flex>
            </GridItem>
            <GridItem colStart={{ base: 6 }}>
              <Flex direction="column" gap={2}>
                <Badge
                  display={{ md: "none" }}
                  variant={"subtle"}
                  colorScheme={getColorSchemeBaseOnTransactionType(
                    inventoryTransaction.transactionType !== undefined
                      ? inventoryTransaction.transactionType
                      : ""
                  )}
                >
                  {getLabelBaseOnTransactionType(
                    inventoryTransaction.transactionReason !== undefined
                      ? inventoryTransaction.transactionReason
                      : ""
                  )}
                  {inventoryTransaction.transactionType === "UP" && (
                    <TriangleUpIcon boxSize={3} ms={2} mb={1} />
                  )}
                  {inventoryTransaction.transactionType === "DOWN" && (
                    <TriangleDownIcon boxSize={3} ms={2} mb={1} />
                  )}
                </Badge>
                {checkRole([ROLES.ADMIN]) && (
                  <>
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
                              {/* <Button
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
                          </Button> */}
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
                  </>
                )}
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
          <ModalHeader>Borrar transacción de inventario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              ¿Estás seguro de eliminar la transacción de inventario{" "}
              <Text as={"b"}>{inventoryTransaction?.asset?.name}</Text>?
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

export default InventoryTransaction
