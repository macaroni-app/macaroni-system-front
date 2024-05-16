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

import { useNavigate } from "react-router-dom"

import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons"
import { useState } from "react"

import { useDeletePaymentMethod } from "../../hooks/useDeletePaymentMethod"
import { useMessage } from "../../hooks/useMessage"
import { useChangeIsActivePaymentMethod } from "../../hooks/useChangeIsActivePaymentMethod"

import { IPaymentMethod } from "./types"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import CustomModal from "../common/CustomModal"

interface Props {
  paymentMethod: IPaymentMethod
}

const PaymentMethod = ({ paymentMethod }: Props) => {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  const [deleteModal, setDeleteModal] = useState(false)

  const { deletePaymentMethod } = useDeletePaymentMethod()
  const { showMessage } = useMessage()

  const { changeIsActivePaymentMethod } = useChangeIsActivePaymentMethod()

  const handleEdit = () => {
    navigate(`${paymentMethod._id}/edit`)
  }

  const handleChangeIsActive = async (isActive: boolean) => {
    setIsLoading(true)

    if (paymentMethod === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }

    let response = undefined

    if (paymentMethod !== undefined && paymentMethod._id !== undefined) {
      response = await changeIsActivePaymentMethod({
        methodPaymentId: paymentMethod._id,
        isActive,
      })
    }

    if (response?.isUpdated) {
      showMessage(
        isActive ? "Método de pago activado." : "Método de pago desactivado.",
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
    navigate("/paymentMethods")
  }

  const handleDelete = async () => {
    setIsLoading(true)

    if (paymentMethod === undefined) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }

    let response = undefined

    if (paymentMethod !== undefined && paymentMethod._id !== undefined) {
      response = await deletePaymentMethod(paymentMethod._id)
    }

    if (response?.isDeleted) {
      showMessage(
        "Método eliminado.",
        AlertStatus.Success,
        AlertColorScheme.Purple
      )
      setIsLoading(false)
    }

    if (!response?.isDeleted) {
      showMessage("Ocurrió un error", AlertStatus.Error, AlertColorScheme.Red)
      setIsLoading(false)
    }
    navigate("/paymentMethods")
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <GridItem colSpan={5} mb={3}>
      <Card variant="outline">
        <CardBody>
          <Grid templateColumns="repeat(6, 1fr)" gap={2} alignItems="center">
            <GridItem colSpan={5}>
              <Flex direction="column" gap={2}>
                <Text fontSize="xl" align="start">
                  {paymentMethod.name}
                </Text>
                <Badge
                  variant="subtle"
                  colorScheme={paymentMethod?.isActive ? "purple" : "red"}
                  alignSelf={"start"}
                >
                  {paymentMethod?.isActive ? "Activo" : "Inactivo"}
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
                            {paymentMethod.isActive ? "Desactivar" : "Activar"}
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
        model={paymentMethod}
        modelName="Método de pago"
        onClose={onClose}
        key={paymentMethod._id}
      />
    </GridItem>
  )
}

export default PaymentMethod
