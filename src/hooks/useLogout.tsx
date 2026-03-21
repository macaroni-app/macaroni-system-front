import { IUserContext } from "../context/types"
import loginService from "../services/login"
import { useAuthContext } from "./useAuthContext"

export const useLogout = () => {
  const { setAuth } = useAuthContext() as IUserContext

  const clearAuth = () => {
    setAuth({})
    return { loggedOut: true }
  }

  const logout = async () => {
    try {
      const response = await loginService.logout()

      if (response?.status === 204) {
        return clearAuth()
      }
    } catch (err) {
      console.error(err)
      return clearAuth()
    }
  }

  return { logout }
}
