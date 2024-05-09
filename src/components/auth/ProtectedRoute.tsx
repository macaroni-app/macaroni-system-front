import { useLocation, Navigate, Outlet } from "react-router-dom"

// custom hooks
import { useAuthContext } from "../../hooks/useAuthContext"

import { IUserContext } from "../../context/types"

interface Props {
  allowedRoles?: number[]
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { auth } = useAuthContext() as IUserContext
  const location = useLocation()

  return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.accessToken ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default ProtectedRoute
