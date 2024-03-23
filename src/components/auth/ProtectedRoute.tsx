import { useLocation, Navigate, Outlet } from "react-router-dom"

// custom hooks
import { useAuthContext } from "../../hooks/useAuthContext"

import { IUserContext } from "../../context/types"

const ProtectedRoute = () => {
  const { auth } = useAuthContext() as IUserContext
  const location = useLocation()

  return auth?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default ProtectedRoute
