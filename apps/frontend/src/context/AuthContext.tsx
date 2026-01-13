import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/auth";

type User = {
  id: string;
  name: string;
  lastname: string;
  email: string;
  rol: string;
};
type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
}>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  console.log("🟡 AuthContext mounted");

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


  return (
    <AuthContext.Provider value={{ user, loading }}>
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

