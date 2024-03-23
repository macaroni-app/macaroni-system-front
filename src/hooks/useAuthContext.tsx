import { useContext } from "react"

import { UserContext } from "../context/UserContext"

export function useAuthContext() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error("useAuthContext must be used within a UserContextProvider")
  }
  return context
}
