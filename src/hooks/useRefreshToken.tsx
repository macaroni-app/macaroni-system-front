import axios from "../services/axios"
import { useAuthContext } from "./useAuthContext"
import { IUserContext } from "../context/types"
import { jwtDecode } from "jwt-decode"
import { emitAuthSessionExpired } from "../utils/authSession"

const USER_URL = "/api/v1/users"

interface UserPayload {
  email: string
  exp: number
  firstName: string
  iat: number
  id: string
  lastName: string
  role: number
}

const useRefreshToken = () => {
  const { setAuth } = useAuthContext() as IUserContext

  const refresh = async () => {
    try {
      const response = await axios.get(`${USER_URL}/refresh`, {
        withCredentials: true,
      })

      const accessToken = response?.data?.accessToken

      if (!accessToken) {
        emitAuthSessionExpired({ reason: "missing" })
        throw new Error("Access token missing from refresh response")
      }

      const decoded = jwtDecode(accessToken) as UserPayload

      const role = decoded?.role

      setAuth({
        accessToken,
        role,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        id: decoded.id,
      })

      return response.data.accessToken
    } catch (error: any) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        emitAuthSessionExpired({ reason: "expired" })
      }
      throw error
    }
  }

  return refresh
}

export default useRefreshToken
