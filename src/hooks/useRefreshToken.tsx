import axios from "../services/axios"
import { useAuthContext } from "./useAuthContext"
import { IUserContext } from "../context/types"
import { jwtDecode } from "jwt-decode"

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
    const response = await axios.get(`${USER_URL}/refresh`, {
      withCredentials: true,
    })
    // setAuth((prev) => {
    //   return { ...prev, accessToken: response.data.accessToken }
    // })

    const accessToken = response?.data?.accessToken

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
  }

  return refresh
}

export default useRefreshToken
