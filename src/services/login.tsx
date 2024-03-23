import axios from "./axios"
import { CreateUser, Credentials } from "./types"

const AUTH_URL = "/api/v1/users"

const loginService = {
  login: async (credentials: Credentials) => {
    const data = await axios.post(`${AUTH_URL}/login`, credentials, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
    return data
  },
  logout: async () => {
    const data = await axios.get(`${AUTH_URL}/logout`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
    return data
  },
  register: async (newUser: CreateUser) => {
    const data = await axios.post(`${AUTH_URL}/register`, newUser)
    return data
  },
  // getUser: async (id) => {
  //   const { data } = await axios.post(`${AUTH_URL}/profile`, id, {
  //     withCredentials: true,
  //   });
  //   return data;
  // },
  // update: async (id, userToUpdate) => {
  //   const { data } = await axios.put(
  //     `${AUTH_URL}/profile/${id}`,
  //     userToUpdate,
  //     {
  //       withCredentials: true,
  //     }
  //   );
  //   return data;
  // },
  // newPassword: async (newPassword) => {
  //   const { data } = await axios.put(`${AUTH_URL}/new-password`, newPassword);
  //   return data;
  // },
  // recoverPassword: async (email) => {
  //   const data = axios.put(`${AUTH_URL}/recovery-password`, email);
  //   return data;
  // },
}

export default loginService
