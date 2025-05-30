import axios from "axios"
const BASE_URL = import.meta.env.VITE_VERCEL_URL

export default axios.create({
  baseURL: BASE_URL,
  timeout: 15000
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})
