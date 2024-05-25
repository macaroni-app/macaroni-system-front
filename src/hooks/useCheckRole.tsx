import { IUserContext } from "../context/types"

import { useAuthContext } from "../hooks/useAuthContext"

export const useCheckRole = () => {
  const { auth } = useAuthContext() as IUserContext

  const checkRole = (allowedRoles: number[]) => {
    return allowedRoles?.includes(Number(auth.role))
  }

  return { checkRole }
}
