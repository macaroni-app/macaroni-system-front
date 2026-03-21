const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";

export interface AuthSessionExpiredDetail {
  reason?: "expired" | "missing" | "unauthorized";
  redirectPath?: string;
}

export const emitAuthSessionExpired = (
  detail: AuthSessionExpiredDetail = {},
) => {
  window.dispatchEvent(
    new CustomEvent<AuthSessionExpiredDetail>(AUTH_SESSION_EXPIRED_EVENT, {
      detail,
    }),
  );
};

export const onAuthSessionExpired = (
  listener: (event: CustomEvent<AuthSessionExpiredDetail>) => void,
) => {
  const wrappedListener = (event: Event) => {
    listener(event as CustomEvent<AuthSessionExpiredDetail>);
  };

  window.addEventListener(
    AUTH_SESSION_EXPIRED_EVENT,
    wrappedListener as EventListener,
  );

  return () => {
    window.removeEventListener(
      AUTH_SESSION_EXPIRED_EVENT,
      wrappedListener as EventListener,
    );
  };
};
