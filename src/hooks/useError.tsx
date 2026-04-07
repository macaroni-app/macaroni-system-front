import { useMessage } from "../hooks/useMessage"

import {
  SOMETHING_WENT_WRONG_MESSAGE,
} from "../utils/constants"
import { AlertColorScheme, AlertStatus } from "../utils/enums"
import { emitAuthSessionExpired } from "../utils/authSession"

export interface Error {
  cause?: unknown
  message: string
  name: string
  stack?: string
  response?: {
    status?: number
    data?: {
      message?: string
    } | Array<{
      message?: string
    }>
  }
}

export const useError = () => {
  const { showMessage } = useMessage()

  const throwError = (error: Error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      emitAuthSessionExpired({ reason: "unauthorized" })
      return
    }

    if (error?.response?.status === 400 || error?.response?.status === 404 || error?.response?.status === 409) {
      const errorData = error?.response?.data
      const responseMessage = Array.isArray(errorData)
        ? errorData[0]?.message
        : errorData?.message

      showMessage(
        responseMessage ?? SOMETHING_WENT_WRONG_MESSAGE,
        AlertStatus.Error,
        AlertColorScheme.Red
      )
    }
  }

  return { throwError }
}
