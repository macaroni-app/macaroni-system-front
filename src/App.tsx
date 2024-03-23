import { Routes, Route } from "react-router-dom"

// components
import Login from "./components/auth/Login"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import PersistLogin from "./components/auth/PersistLogin"

function App(): JSX.Element {
  return (
    <div>
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/forgot-password" element={<ForgotPasswordForm />} /> */}
        {/* <Route path="/recovery-password/:token" element={<NewPasswordForm />} /> */}
        {/* private routes */}
        <Route element={<PersistLogin />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<h1>Hello home</h1>} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
