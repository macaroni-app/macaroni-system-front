import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Spinner, AbsoluteCenter, Box } from "@chakra-ui/react";
import { IUserContext } from "../../context/types";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuthContext() as IUserContext;
  const effectRan = useRef(false);

  useEffect((): (() => void) => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    // In React.StrictMode (dev) effects run twice on mount.
    // Avoid firing refresh twice when refresh token rotation is enabled.
    if (effectRan.current || !import.meta.env.DEV) {
      !auth?.accessToken && persist
        ? verifyRefreshToken()
        : setIsLoading(false);
    }

    return () => {
      isMounted = false;
      effectRan.current = true;
    };
  }, []);

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
  );
};

export default PersistLogin;
