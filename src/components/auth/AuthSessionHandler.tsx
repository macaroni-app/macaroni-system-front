import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { IUserContext } from "../../context/types";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useMessage } from "../../hooks/useMessage";
import { TOKEN_EXPIRED_MESSAGE } from "../../utils/constants";
import { AlertColorScheme, AlertStatus } from "../../utils/enums";
import { onAuthSessionExpired } from "../../utils/authSession";

const AuthSessionHandler = () => {
  const { auth, setAuth } = useAuthContext() as IUserContext;
  const { showMessage } = useMessage();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isHandlingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthSessionExpired(() => {
      const hadAuthenticatedSession =
        sessionStorage.getItem("hadAuthenticatedSession") === "true";

      if (isHandlingRef.current) return;
      if (!auth.accessToken && !hadAuthenticatedSession) return;
      if (!auth.accessToken && location.pathname === "/login") return;

      isHandlingRef.current = true;

      setAuth({});
      queryClient.clear();
      sessionStorage.removeItem("hadAuthenticatedSession");

      if (hadAuthenticatedSession) {
        showMessage(
          TOKEN_EXPIRED_MESSAGE,
          AlertStatus.Warning,
          AlertColorScheme.Purple,
        );
      }

      navigate("/login", { state: { from: location }, replace: true });

      window.setTimeout(() => {
        isHandlingRef.current = false;
      }, 300);
    });

    return unsubscribe;
  }, [auth.accessToken, location, navigate, queryClient, setAuth, showMessage]);

  return null;
};

export default AuthSessionHandler;
