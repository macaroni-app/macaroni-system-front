export interface IAuth {
  accessToken?: string
  roles?: number[]
}

export interface IUserContext {
  auth: IAuth,
  setAuth: (value: IAuth) => void,
  persist: boolean,
  setPersist: (value: boolean) => void
}