import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"

import { ChakraProvider } from "@chakra-ui/react"

import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

import { BrowserRouter, Routes, Route } from "react-router-dom"

import { UserContextProvider } from "./context/UserContext"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 15 * 60 * 1000,
      retry: 2,
    },
  },
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <UserContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </BrowserRouter>
        </UserContextProvider>
      </ChakraProvider>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  </React.StrictMode>
)
