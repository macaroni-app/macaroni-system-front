import { useState } from "react"

import { useNavigate, useParams } from "react-router-dom"

// components
import FixedCostAddEditForm from "./FixedCostAddEditForm"

// custom hooks
import { useFixedCosts } from "../../hooks/useFixedCosts"
import { useNewFixedCost } from "../../hooks/useNewFixedCost"
import { useEditFixedCost } from "../../hooks/useEditFixedCost"
import { useMessage } from "../../hooks/useMessage"
import { Error, useError } from "../../hooks/useError"

// utils
import { RECORD_CREATED, RECORD_UPDATED } from "../../utils/constants"
import { AlertColorScheme, AlertStatus } from "../../utils/enums"

// types
import { IFixedCost } from "./types"

const FixedCostForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const { throwError } = useError()

  const { showMessage } = useMessage()

  const navigate = useNavigate()

  const { fixedCostId } = useParams()

  const queryFixedCosts = useFixedCosts({ id: fixedCostId })

  const fixedCostToUpdate = queryFixedCosts?.data
    ? { ...queryFixedCosts?.data[0] }
    : {}

  const { addNewFixedCost } = useNewFixedCost()
  const { editFixedCost } = useEditFixedCost()

  const onSubmit = async (fixedCost: IFixedCost) => {
    setIsLoading(true)

    try {
      let response
      if (!fixedCostId) {
        response = await addNewFixedCost(fixedCost)
        if (response.isStored) {
          showMessage(
            RECORD_CREATED,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
        }
      } else {
        response = await editFixedCost({
          fixedCostId,
          fixedCostToUpdate: { ...fixedCost },
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
        navigate("/fixedCosts")
      }
    } catch (error: unknown) {
      throwError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const onCancelOperation = () => {
    navigate("/fixedCosts")
  }

  return (
    <FixedCostAddEditForm
      onSubmit={onSubmit}
      onCancelOperation={onCancelOperation}
      fixedCostToUpdate={fixedCostId ? fixedCostToUpdate : {}}
      isEditing={fixedCostId ? true : false}
      isLoading={isLoading}
    />
  )
}

export default FixedCostForm
