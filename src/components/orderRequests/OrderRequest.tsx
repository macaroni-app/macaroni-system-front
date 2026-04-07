import { ChevronDownIcon } from "@chakra-ui/icons"
import {
  Badge,
  Button,
  Card,
  CardBody,
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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Select,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { AxiosError } from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCancelOrderRequest } from "../../hooks/useCancelOrderRequest"
import { useConfirmOrderRequest } from "../../hooks/useConfirmOrderRequest"
import { useConvertOrderRequest } from "../../hooks/useConvertOrderRequest"
import { useMessage } from "../../hooks/useMessage"
import { usePaymentMethods } from "../../hooks/usePaymentMethods"
import { useCheckRole } from "../../hooks/useCheckRole"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import { ORDER_REQUEST_CANCELLED, ORDER_REQUEST_CONFIRMED, ORDER_REQUEST_CONVERTED, SOMETHING_WENT_WRONG_MESSAGE } from "../../utils/constants"
import ProfileBase from "../common/permissions"
import { getApiErrorMessage, getOrderRequestPaymentStatusColorScheme, getOrderRequestPaymentStatusLabel, getOrderRequestStatusColorScheme, getOrderRequestStatusLabel } from "./helpers"
import { IConvertOrderRequestPayload, IOrderRequestFullRelated, OrderRequestStatus } from "./types"

interface Props {
  orderRequest: IOrderRequestFullRelated
}

const OrderRequest = ({ orderRequest }: Props) => {
  const navigate = useNavigate()
  const popover = useDisclosure()
  const convertModal = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")

  const { showMessage } = useMessage()
  const { checkRole } = useCheckRole()
  const { confirmOrderRequest } = useConfirmOrderRequest()
  const { cancelOrderRequest } = useCancelOrderRequest()
  const { convertOrderRequest } = useConvertOrderRequest()

  const queryPaymentMethods = usePaymentMethods({})
  const paymentMethods = queryPaymentMethods.data ?? []

  const orderRequestCreatedDatetime = new Date(
    String(orderRequest?.sortingDate ?? orderRequest?.createdAt),
  ).toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  const canEdit = [
    OrderRequestStatus.DRAFT,
    OrderRequestStatus.CONFIRMED,
  ].includes(orderRequest.status as OrderRequestStatus)

  const handleConfirm = async () => {
    setIsLoading(true)

    try {
      await confirmOrderRequest(orderRequest._id ?? "")
      showMessage(
        ORDER_REQUEST_CONFIRMED,
        AlertStatus.Success,
        AlertColorScheme.Green,
      )
      popover.onClose()
    } catch (error: unknown) {
      showMessage(
        getApiErrorMessage(error, SOMETHING_WENT_WRONG_MESSAGE),
        AlertStatus.Error,
        AlertColorScheme.Red,
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    setIsLoading(true)

    try {
      await cancelOrderRequest(orderRequest._id ?? "")
      showMessage(
        ORDER_REQUEST_CANCELLED,
        AlertStatus.Success,
        AlertColorScheme.Red,
      )
      popover.onClose()
    } catch (error: unknown) {
      showMessage(
        getApiErrorMessage(error, SOMETHING_WENT_WRONG_MESSAGE),
        AlertStatus.Error,
        AlertColorScheme.Red,
      )
    } finally {
      setIsLoading(false)
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

    setIsLoading(true)

    try {
      const response = await convertOrderRequest({
        orderRequestId: orderRequest._id ?? "",
        payload: {
          paymentMethod,
          business: orderRequest.business?._id,
          discount: Number(orderRequest.discount ?? 0),
        } as IConvertOrderRequestPayload,
      })

      showMessage(
        ORDER_REQUEST_CONVERTED,
        AlertStatus.Success,
        AlertColorScheme.Green,
      )
      convertModal.onClose()
      popover.onClose()

      const convertedSale = response?.data?.convertedSale
      if (convertedSale !== undefined) {
        navigate(`/sales/${String(convertedSale)}/details`)
        return
      }

      navigate(`/orderRequests/${orderRequest._id}/details`)
    } catch (error: unknown) {
      showMessage(
        getApiErrorMessage(error, SOMETHING_WENT_WRONG_MESSAGE),
        AlertStatus.Error,
        AlertColorScheme.Red,
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card variant="outline" mb={3}>
        <CardBody>
          <Grid templateColumns="repeat(12, 1fr)" gap={3}>
            <GridItem colSpan={{ base: 12, md: 8 }}>
              <Flex direction="column" gap={2}>
                <Flex gap={2} alignItems="center" flexWrap="wrap">
                  <Text as="b">{orderRequest.client?.name}</Text>
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
                <Text color="gray.600">
                  Nro. de pedido: {orderRequest.orderCode ?? "-"}
                </Text>
                <Text color="gray.600">
                  Fecha: {orderRequestCreatedDatetime}
                </Text>
                <Text color="gray.600">
                  Items: {orderRequest.items?.length ?? 0}
                </Text>
                <Flex gap={2} alignItems="center" flexWrap="wrap">
                  <Text color="gray.600">
                    Pagado: {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      minimumFractionDigits: 2,
                      currency: "ARS",
                    }).format(Number(orderRequest.paidAmount ?? 0))}
                  </Text>
                  <Badge
                    colorScheme={getOrderRequestPaymentStatusColorScheme(orderRequest.paymentStatus)}
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    minH="24px"
                    px={2}
                    py={0}
                    lineHeight={1}
                    textAlign="center"
                  >
                    {getOrderRequestPaymentStatusLabel(orderRequest.paymentStatus)}
                  </Badge>
                </Flex>
              </Flex>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 4 }}>
              <Flex direction="column" alignItems={{ base: "flex-start", md: "flex-end" }} gap={2}>
                <Text as="b">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    minimumFractionDigits: 2,
                    currency: "ARS",
                  }).format(Number(orderRequest.total ?? 0))}
                </Text>
                <Popover isOpen={popover.isOpen} onOpen={popover.onOpen} onClose={popover.onClose}>
                  <PopoverTrigger>
                    <Button rightIcon={<ChevronDownIcon />} isLoading={isLoading}>
                      Acciones
                    </Button>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverBody display="flex" flexDirection="column" gap={2}>
                        <Button variant="ghost" onClick={() => navigate(`/orderRequests/${orderRequest._id}/details`)}>
                          Ver detalle
                        </Button>
                        {canEdit && (
                          <Button variant="ghost" onClick={() => navigate(`/orderRequests/${orderRequest._id}/edit`)}>
                            Editar
                          </Button>
                        )}
                        {orderRequest.status === OrderRequestStatus.DRAFT && (
                          <Button variant="ghost" onClick={handleConfirm} isLoading={isLoading}>
                            Confirmar
                          </Button>
                        )}
                        {orderRequest.status === OrderRequestStatus.CONFIRMED && Number(orderRequest.pendingAmount ?? 0) === 0 && (
                          <Button variant="ghost" onClick={() => convertModal.onOpen()}>
                            Convertir a venta
                          </Button>
                        )}
                        {checkRole(ProfileBase.orderRequests.cancel) &&
                          [OrderRequestStatus.DRAFT, OrderRequestStatus.CONFIRMED].includes(orderRequest.status as OrderRequestStatus) && (
                          <Button variant="ghost" colorScheme="red" onClick={handleCancel} isLoading={isLoading}>
                            Cancelar
                          </Button>
                        )}
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </Flex>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>

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
            <Button colorScheme="purple" onClick={handleConvert} isLoading={isLoading}>
              Convertir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default OrderRequest
