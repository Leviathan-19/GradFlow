import { Navigate } from "react-router-dom";
import { useAuth } from "../api/useAuth";
import type { JSX } from "react";
export default function RoleRoute({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) {
  const user = useAuth();

  if (!user) return <Navigate to="/" replace />;

  if (!allowedRoles.includes(user.rol)) {
    return <Navigate to="/menu" replace />;
  }

  return children;
}
