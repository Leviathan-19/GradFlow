import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  rol: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        id: payload.userId,
        email: payload.email,
        rol: payload.rol,
      });
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  return user;
}
