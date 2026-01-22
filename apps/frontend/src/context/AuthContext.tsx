<<<<<<< HEAD
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api/axios";
=======
import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/auth";
>>>>>>> main

type User = {
  id: string;
  name1: string;
  name2: string;
  lastname1: string;
  lastname2: string;
  email: string;
  rol: string;
  rol_id: string;
  status?: boolean;
};
type AuthContextType = {
  user: User | null;
  loading: boolean;
<<<<<<< HEAD
  isAdmin: boolean;
  isProfessor: boolean;
  isStudent: boolean;
=======
>>>>>>> main
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
}>({
  user: null,
  loading: true,
  isAdmin: false,
  isProfessor: false,
  isStudent: false,
  refreshUser: async () => {},
});

// Role IDs
const ADMIN_ROLE_ID = "682a9457-4e4b-49b6-9674-ebfcbf68938c";
const PROFESSOR_ROLE_ID = "37bb1f3b-aee2-4e1e-995c-0c30a55d5017";
const STUDENT_ROLE_ID = "d70f1978-c472-4cba-a70f-432337f19e9f";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  useEffect(() => {
  console.log("🟡 AuthContext mounted");

<<<<<<< HEAD
    if (!token) {
      setLoading(false);
      return;
    }

    fetchUser().finally(() => setLoading(false));
  }, []);
=======
  getMe()
    .then((data) => {
      console.log("🟢 AUTH /me RESPONSE", data);
      setUser(data);
    })
    .catch((err) => {
      console.error("🔴 AUTH /me ERROR", err);
      setUser(null);
      localStorage.removeItem("token");
    })
    .finally(() => {
      console.log("🟡 AuthContext finished");
      setLoading(false);
    });
}, []);

>>>>>>> main

  const refreshUser = async () => {
    await fetchUser();
  };

  const isAdmin = user?.rol_id === ADMIN_ROLE_ID || user?.rol === "admin";
  const isProfessor = user?.rol_id === PROFESSOR_ROLE_ID || user?.rol === "professor";
  const isStudent = user?.rol_id === STUDENT_ROLE_ID || user?.rol === "student";

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isAdmin, 
        isProfessor, 
        isStudent,
        refreshUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
const fetchMe = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    setUser(null);
    return;
  }

  try {
    const res = await fetch("http://localhost:3008/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.json();
    setUser(data);
  } catch {
    localStorage.removeItem("token");
    setUser(null);
  }
};

useEffect(() => {
  fetchMe().finally(() => setLoading(false));
}, []);

return (
  <AuthContext.Provider value={{ user, loading, refreshUser: fetchMe }}>
    {children}
  </AuthContext.Provider>
);

export const useAuth = () => useContext(AuthContext);

