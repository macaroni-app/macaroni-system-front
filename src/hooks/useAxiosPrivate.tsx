import { axiosPrivate } from "../services/axios"
import { useEffect } from "react"
import useRefreshToken from "./useRefreshToken"
import { useAuthContext } from "./useAuthContext"
import { IUserContext } from "../context/types"
import { emitAuthSessionExpired } from "../utils/authSession"

const useAxiosPrivate = () => {
  const refresh = useRefreshToken()
  const { auth } = useAuthContext() as IUserContext

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"] && auth?.accessToken) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          try {
            prevRequest.sent = true
            const newAccessToken = await refresh()
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
            return axiosPrivate(prevRequest)
          } catch (refreshError) {
            emitAuthSessionExpired({ reason: "expired" })
            return Promise.reject(refreshError)
          }
        }

        if (error?.response?.status === 401 || error?.response?.status === 403) {
          emitAuthSessionExpired({ reason: "unauthorized" })
        }

        return Promise.reject(error)
      }
    )

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
  }, [auth, refresh])

  return axiosPrivate
}

export default useAxiosPrivate
