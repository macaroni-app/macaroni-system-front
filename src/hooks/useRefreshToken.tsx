import axios from "../services/axios"
import { useAuthContext } from "./useAuthContext"
import { IUserContext } from "../context/types"

const USER_URL = "/api/v1/users"

const useRefreshToken = () => {
  const { setAuth } = useAuthContext() as IUserContext

  const refresh = async () => {
    const response = await axios.get(`${USER_URL}/refresh`, {
      withCredentials: true,
    })
    // setAuth((prev) => {
    //   return { ...prev, accessToken: response.data.accessToken }
    // })
    setAuth({ accessToken: response.data.accessToken })

    return response.data.accessToken
  }

  return refresh
}

export default useRefreshToken
