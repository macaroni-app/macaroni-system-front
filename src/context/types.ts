export interface IAuth {
  accessToken?: string
  role?: number
  firstName?: string,
  lastName?: string
}

export interface IUserContext {
  auth: IAuth,
  setAuth: (value: IAuth) => void,
  persist: boolean,
  setPersist: (value: boolean) => void
}