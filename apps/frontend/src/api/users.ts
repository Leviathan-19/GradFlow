import api from "./axios";

// LISTAR
export const listUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

// BUSCAR
export const searchUsers = async (params: any) => {
  const res = await api.get("/users/search", { params });
  return res.data;
};

// CREAR
export const createUser = async (data: any) => {
  const res = await api.post("/users", data);
  return res.data;
};

// ACTUALIZAR
export const updateUser = async (id: string, data: any) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};

// ELIMINAR
export const deleteUser = async (id: string) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
