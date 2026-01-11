// src/api/auth.ts
import axios from "axios";

export const login = async (email: string, password: string) => {
  const res = await axios.post("http://localhost:3001/auth/login", {
    email,
    password,
  });
  return res.data;
};
