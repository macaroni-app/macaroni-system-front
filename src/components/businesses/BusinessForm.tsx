import { useState } from "react"

import { useNavigate, useParams } from "react-router-dom"

// components
import BusinessAddEditForm from "./BusinessAddEditForm"

// custom hooks
import { useMessage } from "../../hooks/useMessage"
import { Error, useError } from "../../hooks/useError"
import { useBusinesses } from "../../hooks/useBusinesses"
import { useNewBusiness } from "../../hooks/useNewBusiness"
import { useEditBusiness } from "../../hooks/useEditBusiness"

import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"
import { IBusiness } from "./types"

const BusinessForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { throwError } = useError()

  const { showMessage } = useMessage()

  const navigate = useNavigate()

  const { businessId } = useParams()

  const queryBusinesses = useBusinesses({ id: businessId })
  const businessToUpdate = queryBusinesses?.data ? { ...queryBusinesses?.data[0] } : {}


  const { addNewBusiness } = useNewBusiness()
  const { editBusiness } = useEditBusiness()

  const onSubmit = async ({ name, cuit, ivaCondition, address }: IBusiness) => {
    setIsLoading(true)

    try {
      let response
      if (!businessId) {
        response = await addNewBusiness({ name, cuit, ivaCondition, address })
        if (response.isStored) {
          showMessage(
            RECORD_CREATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      } else {
        response = await editBusiness({
          businessId,
          businessToUpdate: { name, cuit, ivaCondition, address },
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
        navigate("/businesses")
      }
    } catch (error: unknown) {
      throwError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const onCancelOperation = () => {
    navigate("/businesses")
  }

  return (
    <BusinessAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={onCancelOperation}
      businessToUpdate={businessId ? businessToUpdate : {}}
      isEditing={businessId ? true : false}
      isLoading={isLoading}
    />
  )
}

export default BusinessForm
