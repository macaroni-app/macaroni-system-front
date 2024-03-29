import { useLogout } from "../hooks/useLogout"
import { useMessage } from "../hooks/useMessage"
import { useNavigate, useLocation } from "react-router-dom"

import {
  TOKEN_EXPIRED_MESSAGE,
  SOMETHING_WENT_WRONG_MESSAGE,
} from "../utils/constants"
import { AlertColorScheme, AlertStatus } from "../utils/enums"

export interface Error {
  response: {
    status: number
  }
}

export const useError = () => {
  const { logout } = useLogout()
  const navigate = useNavigate()
  const { showMessage } = useMessage()
  const location = useLocation()

  const throwError = (error: Error) => {
    if (error?.response?.status === 403) {
      logout().then((res) => {
        if (res?.loggedOut) {
          showMessage(
            TOKEN_EXPIRED_MESSAGE,
            AlertStatus.Success,
            AlertColorScheme.Purple
          )
          navigate("/login", { state: { from: location }, replace: true })
        }
      })
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
