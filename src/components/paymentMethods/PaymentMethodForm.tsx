import { useState } from "react"

import { useNavigate, useParams } from "react-router-dom"

// components
import PaymentMethodAddEditForm from "./PaymentMethodAddEditForm"

// custom hooks
import { usePaymentMethods } from "../../hooks/usePaymentMethods"
import { useNewPaymentMethod } from "../../hooks/useNewPaymentMethod"
import { useEditPaymentMethod } from "../../hooks/useEditPaymentMethod"
import { useMessage } from "../../hooks/useMessage"
import { Error, useError } from "../../hooks/useError"

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import { IPaymentMethod } from "./types"

const PaymentMethodForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { throwError } = useError()

  const { showMessage } = useMessage()

  const navigate = useNavigate()

  const { paymentMethodId } = useParams()

  const queryPaymentMethods = usePaymentMethods({ id: paymentMethodId })
  const paymentMethodToUpdate = queryPaymentMethods?.data
    ? { ...queryPaymentMethods?.data[0] }
    : {}

  const { addNewPaymentMethod } = useNewPaymentMethod()
  const { editPaymentMethod } = useEditPaymentMethod()

  const onSubmit = async ({ name }: IPaymentMethod) => {
    setIsLoading(true)

    try {
      let response
      if (!paymentMethodId) {
        response = await addNewPaymentMethod({ name })
        if (response.isStored) {
          showMessage(
            RECORD_CREATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      } else {
        response = await editPaymentMethod({
          paymentMethodId,
          paymentMethodToUpdate: { name },
        })
        if (response.isUpdated) {
          showMessage(
            RECORD_UPDATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      }
      if (response.status === 200 || response.status === 201) {
        navigate("/paymentMethods")
      }
    } catch (error: unknown) {
      throwError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const onCancelOperation = () => {
    navigate("/paymentMethods")
  }

  return (
    <PaymentMethodAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={onCancelOperation}
      paymentMethodToUpdate={paymentMethodId ? paymentMethodToUpdate : {}}
      isEditing={paymentMethodId ? true : false}
      isLoading={isLoading}
    />
  )
}

export default PaymentMethodForm
