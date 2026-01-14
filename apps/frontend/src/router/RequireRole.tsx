import { Navigate } from "react-router-dom";
import { useAuth } from "../api/useAuth";
import type { JSX } from "react";
export default function RequireRole({
  role,
  children
}: {
  role: string;
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user || user.rol?.toUpperCase() !== role) {
    return <Navigate to="/menu" />;
  }

  return children;
}
