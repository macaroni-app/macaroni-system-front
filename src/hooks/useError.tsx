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
  }
}

export const useError = () => {
  const { showMessage } = useMessage()

  const throwError = (error: Error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      emitAuthSessionExpired({ reason: "unauthorized" })
      return
    }
    if (error?.response?.status === 400) {
      showMessage(
        SOMETHING_WENT_WRONG_MESSAGE,
        AlertStatus.Error,
        AlertColorScheme.Red
      )
    }
  }

  return { throwError }
}
