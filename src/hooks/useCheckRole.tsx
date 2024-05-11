import { IUserContext } from "../context/types"

import { useAuthContext } from "../hooks/useAuthContext"

export const useCheckRole = () => {
  const { auth } = useAuthContext() as IUserContext

  const checkRole = (allowedRoles: number[]) => {
    return auth.roles
      ?.map((role) => allowedRoles?.includes(role))
      .find((val) => val)
  }

  return { checkRole }
}
