import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";
import Menu from "../pages/Menu/Menu";
import Admin from "../pages/Admin/Admin";
import RequireRole from "./RequireRole";
import ProtectedRoute from "./ProtectedRoute";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Menu (any logged user) */}
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <RequireRole role="ADMIN">
              <Admin />
            </RequireRole>
          }
        />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
