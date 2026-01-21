import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

// Role IDs
const ADMIN_ROLE_ID = "682a9457-4e4b-49b6-9674-ebfcbf68938c";
const PROFESSOR_ROLE_ID = "37bb1f3b-aee2-4e1e-995c-0c30a55d5017";
const STUDENT_ROLE_ID = "d70f1978-c472-4cba-a70f-432337f19e9f";

export default function RequireRole({
  role,
  children
}: {
  role: "admin" | "professor" | "student";
  children: JSX.Element;
}) {
  const { user, loading, isAdmin, isProfessor, isStudent } = useAuth();

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check role by ID or name
  let hasRole = false;
  switch (role.toLowerCase()) {
    case "admin":
      hasRole = isAdmin;
      break;
    case "professor":
      hasRole = isProfessor;
      break;
    case "student":
      hasRole = isStudent;
      break;
  }

  if (!hasRole) {
    return <Navigate to="/menu" />;
  }

  return children;
}
