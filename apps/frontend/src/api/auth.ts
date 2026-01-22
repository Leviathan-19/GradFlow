import api from "./axios";

// 🔐 LOGIN → puerto 3007
export const login = async (email: string, password: string) => {
<<<<<<< HEAD
  const res = await api.post("/auth/login", {
    email,
    password,
  });
=======
  console.log("🟡 login() called", { email });

  const res = await axios.post(
    "http://localhost:3006/api/auth/login",
    { email, password }
  );

  console.log("🟢 login() response", res.data);

  localStorage.setItem("token", res.data.token);

>>>>>>> main
  return res.data;
};

export const getMe = async () => {
<<<<<<< HEAD
  const res = await api.get("/auth/me");
  return res.data;
};

export const getRoles = async () => {
  const res = await api.get("/auth/roles");
  return res.data;
};

export const getToken = () => {
  return localStorage.getItem("token");
=======
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const res = await axios.get("http://localhost:3008/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
>>>>>>> main
};

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
