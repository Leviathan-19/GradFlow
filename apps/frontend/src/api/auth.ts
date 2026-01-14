import api from "./axios";

// 🔐 LOGIN → puerto 3007
export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  return res.data;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
