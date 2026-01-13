import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

export default function RequireRole({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user || !allowedRoles.includes(user.rol)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
