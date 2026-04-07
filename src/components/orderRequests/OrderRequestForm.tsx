import { useState } from "react"
import { SubmitHandler } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { useAddOrderRequestPayment } from "../../hooks/useAddOrderRequestPayment"
import { useBusinesses } from "../../hooks/useBusinesses"
import { useClients } from "../../hooks/useClients"
import { useDeleteManyOrderRequestItem } from "../../hooks/useDeleteManyOrderRequestItem"
import { useEditOrderRequest } from "../../hooks/useEditOrderRequest"
import { useEditOrderRequestItem } from "../../hooks/useEditOrderRequestItem"
import { useMessage } from "../../hooks/useMessage"
import { useNewManyOrderRequestItem } from "../../hooks/useNewManyOrderRequestItem"
import { useNewOrderRequest } from "../../hooks/useNewOrderRequest"
import { useOrderRequest } from "../../hooks/useOrderRequest"
import { useProducts } from "../../hooks/useProducts"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import { RECORD_CREATED, RECORD_UPDATED, SOMETHING_WENT_WRONG_MESSAGE } from "../../utils/constants"
import { IBusiness } from "../businesses/types"
import { IClient } from "../clients/types"
import { IProductFullRelated } from "../products/types"
import OrderRequestAddForm from "./OrderRequestAddForm"
import { buildInitialPaymentPayload, buildOrderRequestItemPayloads, getApiErrorMessage } from "./helpers"
import { IOrderRequestFullRelated, IOrderRequestItemLessRelated, IOrderRequestLessRelated } from "./types"
import { usePaymentMethods } from "../../hooks/usePaymentMethods"

type OrderRequestResponse = {
  data?: IOrderRequestFullRelated
  isStored?: boolean
  isUpdated?: boolean
  status?: number
}

const OrderRequestForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const { orderRequestId } = useParams()
  const { showMessage } = useMessage()

  const queryOrderRequest = useOrderRequest(orderRequestId)
  const queryProducts = useProducts({})
  const queryClients = useClients({})
  const queryBusinesses = useBusinesses({})
  const queryPaymentMethods = usePaymentMethods({})

  const { addNewOrderRequest } = useNewOrderRequest()
  const { addOrderRequestPayment } = useAddOrderRequestPayment()
  const { editOrderRequest } = useEditOrderRequest()
  const { addNewManyOrderRequestItem } = useNewManyOrderRequestItem()
  const { editOrderRequestItem } = useEditOrderRequestItem()
  const { deleteManyOrderRequestItem } = useDeleteManyOrderRequestItem()

  const orderRequest = queryOrderRequest.data as IOrderRequestFullRelated | undefined
  const products = queryProducts.data as IProductFullRelated[]
  const clients = queryClients.data as IClient[]
  const businesses = queryBusinesses.data as IBusiness[]
  const paymentMethods = queryPaymentMethods.data ?? []
  const orderRequestHasPayments = (orderRequest?.payments?.length ?? 0) > 0

  const currentBusiness = orderRequest?.business?._id
    ? orderRequest.business._id
    : businesses?.find((business) => business?.cuit === "23393153504")?._id

  const onSubmit: SubmitHandler<IOrderRequestLessRelated> = async (
    currentOrderRequest,
  ) => {
    setIsLoading(true)

    try {
      const orderRequestPayload: IOrderRequestLessRelated = {
        client: currentOrderRequest.client,
        isRetail: currentOrderRequest.isRetail,
        discount: Number(currentOrderRequest.discount ?? 0),
        total: undefined,
        business: currentBusiness,
      }

      orderRequestPayload.total = buildOrderRequestItemPayloads(
        currentOrderRequest.items,
        orderRequestId ?? "",
        products,
        currentOrderRequest.isRetail,
        currentOrderRequest.discount,
      ).reduce((accumulator, item) => accumulator + Number(item.subtotal ?? 0), 0)

      let response: OrderRequestResponse
      const initialPaymentPayload = buildInitialPaymentPayload(
        currentOrderRequest.initialPaymentAmount,
        currentOrderRequest.initialPaymentMethod,
        currentOrderRequest.initialPaymentNote,
      )

      if (orderRequestId === undefined) {
        if (
          currentOrderRequest.initialPaymentAmount !== undefined &&
          Number(currentOrderRequest.initialPaymentAmount) > 0 &&
          initialPaymentPayload === undefined
        ) {
          showMessage(
            "Completá el método de pago de la seña",
            AlertStatus.Error,
            AlertColorScheme.Red,
          )
          return
        }

        if (initialPaymentPayload !== undefined) {
          orderRequestPayload.payments = [initialPaymentPayload]
        }

        response = await addNewOrderRequest(orderRequestPayload)

        const createdOrderRequestId = response?.data?._id

        if (createdOrderRequestId !== undefined) {
          const itemsToCreate = buildOrderRequestItemPayloads(
            currentOrderRequest.items,
            createdOrderRequestId,
            products,
            currentOrderRequest.isRetail,
            currentOrderRequest.discount,
          )

          if (itemsToCreate.length > 0) {
            await addNewManyOrderRequestItem(itemsToCreate)
          }

          showMessage(
            RECORD_CREATED,
            AlertStatus.Success,
            AlertColorScheme.Purple,
          )
          navigate(`/orderRequests/${createdOrderRequestId}/details`)
          return
        }
      } else {
        if (
          currentOrderRequest.initialPaymentAmount !== undefined &&
          Number(currentOrderRequest.initialPaymentAmount) > 0 &&
          initialPaymentPayload === undefined
        ) {
          showMessage(
            "Completá el método de pago del nuevo pago",
            AlertStatus.Error,
            AlertColorScheme.Red,
          )
          return
        }

        await editOrderRequest({
          orderRequestId,
          orderRequestToUpdate: orderRequestPayload,
        })

        const existingItems = orderRequest?.items ?? []
        const updatedItemsPayload = buildOrderRequestItemPayloads(
          currentOrderRequest.items,
          orderRequestId,
          products,
          currentOrderRequest.isRetail,
          currentOrderRequest.discount,
        )

        const existingIds = new Set(
          existingItems
            .map((item) => item._id)
            .filter((itemId): itemId is string => itemId !== undefined),
        )
        const currentIds = new Set(
          updatedItemsPayload
            .map((item) => item.id)
            .filter((itemId): itemId is string => itemId !== undefined),
        )

        const itemsToCreate = updatedItemsPayload.filter((item) => item.id === undefined)
        const itemsToUpdate = updatedItemsPayload.filter((item) => item.id !== undefined)
        const itemsToDelete = [...existingIds]
          .filter((itemId) => !currentIds.has(itemId))
          .map((itemId) => ({ id: itemId })) as IOrderRequestItemLessRelated[]

        await Promise.all(
          itemsToUpdate.map(async (item) => {
            await editOrderRequestItem({
              orderRequestItemId: item.id ?? "",
              orderRequestItemToUpdate: item,
            })
          }),
        )

        if (itemsToCreate.length > 0) {
          await addNewManyOrderRequestItem(itemsToCreate)
        }

        if (itemsToDelete.length > 0) {
          await deleteManyOrderRequestItem(itemsToDelete)
        }

        if (!orderRequestHasPayments && initialPaymentPayload !== undefined) {
          await addOrderRequestPayment({
            orderRequestId,
            payload: initialPaymentPayload,
          })
        }

        showMessage(
          RECORD_UPDATED,
          AlertStatus.Success,
          AlertColorScheme.Purple,
        )
        navigate(`/orderRequests/${orderRequestId}/details`)
        return
      }

      showMessage(
        SOMETHING_WENT_WRONG_MESSAGE,
        AlertStatus.Error,
        AlertColorScheme.Red,
      )
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, SOMETHING_WENT_WRONG_MESSAGE)

      showMessage(
        message,
        AlertStatus.Error,
        AlertColorScheme.Red,
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelOperation = () => {
    if (orderRequestId !== undefined) {
      navigate(`/orderRequests/${orderRequestId}/details`)
      return
    }

    navigate("/orderRequests")
  }

  return (
    <OrderRequestAddForm
      onSubmit={onSubmit}
      onCancelOperation={handleCancelOperation}
      orderRequestToUpdate={orderRequest}
      isLoading={
        isLoading ||
        queryOrderRequest.isLoading ||
        queryProducts.isLoading ||
        queryClients.isLoading ||
        queryBusinesses.isLoading ||
        queryPaymentMethods.isLoading
      }
      products={products}
      clients={clients?.filter((client) => client.isActive)}
      paymentMethods={paymentMethods}
    />
  )
}

export default OrderRequestForm
