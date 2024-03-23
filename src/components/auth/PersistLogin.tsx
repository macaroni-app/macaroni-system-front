import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import useRefreshToken from "../../hooks/useRefreshToken"
import { useAuthContext } from "../../hooks/useAuthContext"
import { Spinner, AbsoluteCenter, Box } from "@chakra-ui/react"
import { IUserContext } from "../../context/types"

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const refresh = useRefreshToken()
  const { auth, persist } = useAuthContext() as IUserContext

  useEffect((): (() => void) => {
    let isMounted = true

    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (err) {
        console.error(err)
      } finally {
        isMounted && setIsLoading(false)
      }
    }

    // persist added here AFTER tutorial video
    // Avoids unwanted call to verifyRefreshToken
    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false)

    return () => (isMounted = false)
  }, [])

  // useEffect(() => {
  //   console.log(`isLoading: ${isLoading}`);
  //   console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
  // }, [isLoading]);

  return (
    <>
      {!persist ? (
        <Outlet />
      ) : isLoading ? (
        <Box position="relative" h="90vh">
          <AbsoluteCenter axis="both">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="purple.500"
              size="xl"
            />
          </AbsoluteCenter>
        </Box>
      ) : (
        <Outlet />
      )}
    </>
  )
}

export default PersistLogin
