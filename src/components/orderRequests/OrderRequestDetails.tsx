import { ChevronLeftIcon, DownloadIcon } from "@chakra-ui/icons"
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  Select,
  Skeleton,
  Spacer,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useCancelOrderRequest } from "../../hooks/useCancelOrderRequest"
import { useConfirmOrderRequest } from "../../hooks/useConfirmOrderRequest"
import { useConvertOrderRequest } from "../../hooks/useConvertOrderRequest"
import { useAddOrderRequestPayment } from "../../hooks/useAddOrderRequestPayment"
import { useInventories } from "../../hooks/useInventories"
import { useMessage } from "../../hooks/useMessage"
import { useOrderRequest } from "../../hooks/useOrderRequest"
import { usePaymentMethods } from "../../hooks/usePaymentMethods"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import { ORDER_REQUEST_CANCELLED, ORDER_REQUEST_CONFIRMED, ORDER_REQUEST_CONVERTED, SOMETHING_WENT_WRONG_MESSAGE } from "../../utils/constants"
import { getApiErrorMessage, getInventoryNameByReservedItem, getOrderRequestPaymentStatusColorScheme, getOrderRequestPaymentStatusLabel, getOrderRequestStatusColorScheme, getOrderRequestStatusLabel, getPaymentMethodLabel } from "./helpers"
import { IOrderRequestFullRelated, OrderRequestPaymentStatus, OrderRequestStatus } from "./types"
import { generateOrderRequestSummaryPdf } from "./generateOrderRequestSummaryPdf"

const OrderRequestDetails = () => {
  const { orderRequestId } = useParams()
  const navigate = useNavigate()
  const convertModal = useDisclosure()
  const paymentModal = useDisclosure()
  const [paymentMethod, setPaymentMethod] = useState("")
  const [newPaymentAmount, setNewPaymentAmount] = useState("")
  const [newPaymentMethod, setNewPaymentMethod] = useState("")
  const [newPaymentNote, setNewPaymentNote] = useState("")
  const [isLoadingAction, setIsLoadingAction] = useState(false)

  const { showMessage } = useMessage()
  const { confirmOrderRequest } = useConfirmOrderRequest()
  const { cancelOrderRequest } = useCancelOrderRequest()
  const { convertOrderRequest } = useConvertOrderRequest()
  const { addOrderRequestPayment } = useAddOrderRequestPayment()

  const queryOrderRequest = useOrderRequest(orderRequestId)
  const queryInventories = useInventories({})
  const queryPaymentMethods = usePaymentMethods({})

  const orderRequest = queryOrderRequest.data as IOrderRequestFullRelated | undefined
  const paymentMethods = queryPaymentMethods.data ?? []
  const inventories = queryInventories.inventories

  const handleGoBack = () => {
    navigate("/orderRequests")
  }

  const handleDownloadSummary = () => {
    if (orderRequest === undefined) {
      return
    }

    generateOrderRequestSummaryPdf(orderRequest)
  }

  const handleConfirm = async () => {
    setIsLoadingAction(true)

    try {
      await confirmOrderRequest(orderRequestId ?? "")
      showMessage(
        ORDER_REQUEST_CONFIRMED,
        AlertStatus.Success,
        AlertColorScheme.Green,
      )
    } catch (error: unknown) {
      showMessage(
        getApiErrorMessage(error, SOMETHING_WENT_WRONG_MESSAGE),
        AlertStatus.Error,
        AlertColorScheme.Red,
      )
    } finally {
      setIsLoadingAction(false)
    }
  }

  const handleCancel = async () => {
    setIsLoadingAction(true)

    try {
      await cancelOrderRequest(orderRequestId ?? "")
      showMessage(
        ORDER_REQUEST_CANCELLED,
        AlertStatus.Success,
        AlertColorScheme.Red,
      )
    } catch (error: unknown) {
      showMessage(
        getApiErrorMessage(error, SOMETHING_WENT_WRONG_MESSAGE),
        AlertStatus.Error,
        AlertColorScheme.Red,
      )
    } finally {
      setIsLoadingAction(false)
    }
  }

  const handleConvert = async () => {
    if (paymentMethod === "") {
      showMessage(
        "Seleccioná un método de pago",
        AlertStatus.Error,
        AlertColorScheme.Red,
      )
      return
    }

    setIsLoadingAction(true)

    try {
      const response = await convertOrderRequest({
        orderRequestId: orderRequestId ?? "",
        payload: {
          paymentMethod,
          business: orderRequest?.business?._id,
          discount: Number(orderRequest?.discount ?? 0),
        },
      })

      showMessage(
        ORDER_REQUEST_CONVERTED,
        AlertStatus.Success,
        AlertColorScheme.Green,
      )
      convertModal.onClose()

      const convertedSale = response?.data?.convertedSale

      if (convertedSale !== undefined) {
        navigate(`/sales/${String(convertedSale)}/details`)
        return
      }
    } catch (error: unknown) {
      showMessage(
        getApiErrorMessage(error, SOMETHING_WENT_WRONG_MESSAGE),
        AlertStatus.Error,
        AlertColorScheme.Red,
      )
    } finally {
      setIsLoadingAction(false)
    }
  }

  const handleAddPayment = async () => {
    if (newPaymentAmount === "" || Number(newPaymentAmount) <= 0) {
      showMessage(
        "Ingresá un monto válido",
        AlertStatus.Error,
        AlertColorScheme.Red,
      )
      return
    }

    if (newPaymentMethod === "") {
      showMessage(
        "Seleccioná un método de pago",
        AlertStatus.Error,
        AlertColorScheme.Red,
      )
      return
    }

    setIsLoadingAction(true)

    try {
      await addOrderRequestPayment({
        orderRequestId: orderRequestId ?? "",
        payload: {
          amount: Number(newPaymentAmount),
          paymentMethod: newPaymentMethod,
          note: newPaymentNote,
        },
      })

      showMessage(
        "Pago registrado",
        AlertStatus.Success,
        AlertColorScheme.Green,
      )
      paymentModal.onClose()
      setNewPaymentAmount("")
      setNewPaymentMethod("")
      setNewPaymentNote("")
    } catch (error: unknown) {
      showMessage(
        getApiErrorMessage(error, SOMETHING_WENT_WRONG_MESSAGE),
        AlertStatus.Error,
        AlertColorScheme.Red,
      )
    } finally {
      setIsLoadingAction(false)
    }
  }

  const canEdit = [
    OrderRequestStatus.DRAFT,
    OrderRequestStatus.CONFIRMED,
  ].includes(orderRequest?.status as OrderRequestStatus)

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
              <Flex wrap="wrap" gap={2}>
                <Button
                  onClick={handleGoBack}
                  colorScheme="blue"
                  variant="outline"
                >
                  <ChevronLeftIcon boxSize={4} me={1} />
                  Volver
                </Button>
                <Button
                  onClick={handleDownloadSummary}
                  colorScheme="purple"
                  variant="outline"
                  leftIcon={<DownloadIcon boxSize={3} />}
                >
                  Descargar resumen
                </Button>
                <Spacer />
                {canEdit && (
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/orderRequests/${orderRequestId}/edit`)}
                  >
                    Editar
                  </Button>
                )}
                {orderRequest?.status === OrderRequestStatus.DRAFT && (
                  <Button
                    colorScheme="green"
                    onClick={handleConfirm}
                    isLoading={isLoadingAction}
                  >
                    Confirmar
                  </Button>
                )}
                {orderRequest?.status === OrderRequestStatus.CONFIRMED && (
                  <Button
                    colorScheme="purple"
                    onClick={convertModal.onOpen}
                    isDisabled={Number(orderRequest.pendingAmount ?? 0) > 0}
                  >
                    Convertir a venta
                  </Button>
                )}
                {[OrderRequestStatus.DRAFT, OrderRequestStatus.CONFIRMED].includes(orderRequest?.status as OrderRequestStatus) && (
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    onClick={paymentModal.onOpen}
                  >
                    Registrar pago
                  </Button>
                )}
                {[OrderRequestStatus.DRAFT, OrderRequestStatus.CONFIRMED].includes(orderRequest?.status as OrderRequestStatus) && (
                  <Button
                    colorScheme="red"
                    variant="outline"
                    onClick={handleCancel}
                    isLoading={isLoadingAction}
                  >
                    Cancelar pedido
                  </Button>
                )}
                {orderRequest?.status === OrderRequestStatus.CONVERTED &&
                  orderRequest?.convertedSale !== undefined && (
                  <Button
                    colorScheme="blue"
                    onClick={() => navigate(`/sales/${typeof orderRequest.convertedSale === "string" ? orderRequest.convertedSale : orderRequest.convertedSale._id}/details`)}
                  >
                    Ver venta
                  </Button>
                )}
              </Flex>
            </CardBody>
          </Card>
        </GridItem>

        {queryOrderRequest.isLoading && (
          <GridItem
            mt={1}
            colSpan={{ base: 10, lg: 8 }}
            colStart={{ base: 2, lg: 3 }}
          >
            <Card variant="outline">
              <CardBody>
                <Stack>
                  <Skeleton height="40px" />
                  <Skeleton height="40px" />
                  <Skeleton height="40px" />
                </Stack>
              </CardBody>
            </Card>
          </GridItem>
        )}

        {!queryOrderRequest.isLoading && orderRequest !== undefined && (
          <GridItem
            mt={1}
            colSpan={{ base: 10, lg: 8 }}
            colStart={{ base: 2, lg: 3 }}
          >
            <Card variant="outline">
              <CardBody>
                <Flex mb={2} justifyContent="space-between" wrap="wrap" gap={2}>
                  <Text fontSize="lg">Nro. de pedido:</Text>
                  <Text as="b" fontSize="lg">
                    {orderRequest.orderCode ?? "-"}
                  </Text>
                </Flex>
                <Flex mb={2} justifyContent="space-between" wrap="wrap" gap={2}>
                  <Text fontSize="lg">Cliente:</Text>
                  <Text as="b" fontSize="lg">
                    {orderRequest.client?.name}
                  </Text>
                </Flex>
                <Flex mb={2} justifyContent="space-between" wrap="wrap" gap={2}>
                  <Text fontSize="lg">Estado:</Text>
                  <Badge
                    colorScheme={getOrderRequestStatusColorScheme(orderRequest.status as OrderRequestStatus)}
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    minH="24px"
                    px={2}
                    py={0}
                    lineHeight={1}
                    textAlign="center"
                  >
                    {getOrderRequestStatusLabel(orderRequest.status as OrderRequestStatus)}
                  </Badge>
                </Flex>
                <Flex mb={2} justifyContent="space-between" wrap="wrap" gap={2}>
                  <Text fontSize="lg">Estado de pago:</Text>
                  <Badge
                    colorScheme={getOrderRequestPaymentStatusColorScheme(orderRequest.paymentStatus as OrderRequestPaymentStatus)}
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    minH="24px"
                    px={2}
                    py={0}
                    lineHeight={1}
                    textAlign="center"
                  >
                    {getOrderRequestPaymentStatusLabel(orderRequest.paymentStatus as OrderRequestPaymentStatus)}
                  </Badge>
                </Flex>
                <Flex mb={2} justifyContent="space-between" wrap="wrap" gap={2}>
                  <Text fontSize="lg">Descuento aplicado:</Text>
                  <Text as="b" fontSize="lg">
                    {Number(orderRequest.discount ?? 0)} %
                  </Text>
                </Flex>
                <Flex mb={2} justifyContent="space-between" wrap="wrap" gap={2}>
                  <Text fontSize="lg">Total:</Text>
                  <Text as="b" fontSize="lg">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      minimumFractionDigits: 2,
                      currency: "ARS",
                    }).format(Number(orderRequest.total ?? 0))}
                  </Text>
                </Flex>
                <Flex mb={2} justifyContent="space-between" wrap="wrap" gap={2}>
                  <Text fontSize="lg">Total entregado:</Text>
                  <Text as="b" fontSize="lg">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      minimumFractionDigits: 2,
                      currency: "ARS",
                    }).format(Number(orderRequest.paidAmount ?? 0))}
                  </Text>
                </Flex>
                <Flex mb={2} justifyContent="space-between" wrap="wrap" gap={2}>
                  <Text fontSize="lg">Saldo pendiente:</Text>
                  <Text as="b" fontSize="lg">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      minimumFractionDigits: 2,
                      currency: "ARS",
                    }).format(Number(orderRequest.pendingAmount ?? 0))}
                  </Text>
                </Flex>

                <Box py={3}>
                  <Divider />
                </Box>

                <Text fontSize="lg" mb={3}>Productos</Text>
                <TableContainer mb={4}>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Producto</Th>
                        <Th>Cantidad</Th>
                        <Th isNumeric>Subtotal</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {orderRequest.items?.map((item) => (
                        <Tr key={item._id}>
                          <Td>{item.product?.name}</Td>
                          <Td>{Number(item.quantity ?? 0)}</Td>
                          <Td isNumeric>
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              minimumFractionDigits: 2,
                              currency: "ARS",
                            }).format(Number(item.subtotal ?? 0))}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>

                {orderRequest.payments !== undefined &&
                  orderRequest.payments.length > 0 && (
                    <>
                      <Text fontSize="lg" mb={3}>Pagos registrados</Text>
                      <TableContainer mb={4}>
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Fecha</Th>
                              <Th>Medio</Th>
                              <Th>Nota</Th>
                              <Th isNumeric>Monto</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {orderRequest.payments.map((payment, index) => (
                              <Tr key={`${payment.createdAt}-${index}`}>
                                <Td>
                                  {payment.createdAt !== undefined
                                    ? new Date(String(payment.createdAt)).toLocaleString("es-AR")
                                    : "-"}
                                </Td>
                                <Td>{getPaymentMethodLabel(payment.paymentMethod as string | { _id?: string, name?: string })}</Td>
                                <Td>{payment.note ?? "-"}</Td>
                                <Td isNumeric>
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    minimumFractionDigits: 2,
                                    currency: "ARS",
                                  }).format(Number(payment.amount ?? 0))}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </>
                )}

                {orderRequest.reservedItems !== undefined &&
                  orderRequest.reservedItems.length > 0 && (
                    <>
                      <Text fontSize="lg" mb={3}>Stock reservado</Text>
                      <TableContainer>
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Insumo</Th>
                              <Th isNumeric>Cantidad reservada</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {orderRequest.reservedItems.map((reservedItem, index) => (
                              <Tr key={`${reservedItem.asset}-${index}`}>
                                <Td>
                                  {getInventoryNameByReservedItem(
                                    typeof reservedItem.inventory === "string"
                                      ? reservedItem.inventory
                                      : undefined,
                                    reservedItem.asset,
                                    inventories,
                                  )}
                                </Td>
                                <Td isNumeric>{Number(reservedItem.quantity ?? 0)}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </>
                )}
              </CardBody>
            </Card>
          </GridItem>
        )}
      </Grid>

      <Modal isOpen={convertModal.isOpen} onClose={convertModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Convertir pedido a venta</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={3}>Seleccioná el método de pago para la venta.</Text>
            <Select
              placeholder="Método de pago"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
            >
              {paymentMethods.map((currentPaymentMethod) => (
                <option key={currentPaymentMethod._id} value={currentPaymentMethod._id}>
                  {currentPaymentMethod.name}
                </option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={convertModal.onClose}>
              Cancelar
            </Button>
            <Button colorScheme="purple" onClick={handleConvert} isLoading={isLoadingAction}>
              Convertir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={paymentModal.isOpen} onClose={paymentModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Registrar pago</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" gap={3}>
            <Input
              placeholder="Monto"
              type="number"
              value={newPaymentAmount}
              onChange={(event) => setNewPaymentAmount(event.target.value)}
            />
            <Select
              placeholder="Método de pago"
              value={newPaymentMethod}
              onChange={(event) => setNewPaymentMethod(event.target.value)}
            >
              {paymentMethods.map((currentPaymentMethod) => (
                <option key={currentPaymentMethod._id} value={currentPaymentMethod._id}>
                  {currentPaymentMethod.name}
                </option>
              ))}
            </Select>
            <Input
              placeholder="Observación"
              value={newPaymentNote}
              onChange={(event) => setNewPaymentNote(event.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={paymentModal.onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleAddPayment} isLoading={isLoadingAction}>
              Guardar pago
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default OrderRequestDetails
