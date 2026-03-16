import { Navigate, Outlet } from "react-router-dom"

import { useAuthContext } from "../../hooks/useAuthContext"
import { IUserContext } from "../../context/types"

const PublicRoute = () => {
  const { auth } = useAuthContext() as IUserContext

  return auth?.accessToken ? <Navigate to="/" replace /> : <Outlet />
}

export default PublicRoute
