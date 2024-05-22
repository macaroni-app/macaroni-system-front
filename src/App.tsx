import { Routes, Route } from "react-router-dom"

// components
import Login from "./components/auth/Login"
import Home from "./components/common/Home"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import PersistLogin from "./components/auth/PersistLogin"

import { ROLES } from "./components/common/roles"

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
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.SELLER]}
              />
            }
          >
            <Route path="/*" element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
