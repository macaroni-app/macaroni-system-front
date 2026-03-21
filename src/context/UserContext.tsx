import { createContext, useEffect, useState, ReactNode } from "react"
import { IAuth } from "./types"

interface Props {
  children: ReactNode
}

export const UserContext = createContext({})

export const UserContextProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState<IAuth>({})
  const [persist, setPersist] = useState<boolean>(
    JSON.parse(localStorage.getItem("persist") as string) || true
  )

  useEffect(() => {
    if (auth.accessToken) {
      sessionStorage.setItem("hadAuthenticatedSession", "true")
    }
  }, [auth.accessToken])

  return (
    <UserContext.Provider
      value={{
        auth,
        setAuth,
        persist,
        setPersist,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
