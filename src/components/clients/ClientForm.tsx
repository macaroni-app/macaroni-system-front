import { useState } from "react"

import { useNavigate, useParams } from "react-router-dom"

// components
import ClientAddEditForm from "./ClientAddEditForm"

// custom hooks
import { useClients } from "../../hooks/useClients"
import { useNewClient } from "../../hooks/useNewClient"
import { useMessage } from "../../hooks/useMessage"
import { Error, useError } from "../../hooks/useError"

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import { IClient } from "./types"
import { useEditClient } from "../../hooks/useEditClient"

const ClientForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { throwError } = useError()

  const { showMessage } = useMessage()

  const navigate = useNavigate()

  const { clientId } = useParams()

  const queryClients = useClients({ id: clientId })
  const clientToUpdate = queryClients?.data ? { ...queryClients?.data[0] } : {}

  const { addNewClient } = useNewClient()
  const { editClient } = useEditClient()

  const onSubmit = async ({ name }: IClient) => {
    setIsLoading(true)

    try {
      let response
      if (!clientId) {
        response = await addNewClient({ name })
        if (response.isStored) {
          showMessage(
            RECORD_CREATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      } else {
        response = await editClient({
          clientId,
          clientToUpdate: { name },
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
        navigate("/clients")
      }
    } catch (error: unknown) {
      throwError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const onCancelOperation = () => {
    navigate("/clients")
  }

  return (
    <ClientAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={onCancelOperation}
      clientToUpdate={clientId ? clientToUpdate : {}}
      isEditing={clientId ? true : false}
      isLoading={isLoading}
    />
  )
}

export default ClientForm
