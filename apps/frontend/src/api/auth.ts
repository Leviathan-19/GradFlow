import axios from "axios";

export const login = async (email: string, password: string) => {
  const res = await axios.post("http://localhost:3006/auth/login", {
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
  window.location.href = "/";
};
