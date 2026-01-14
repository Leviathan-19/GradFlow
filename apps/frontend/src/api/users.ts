import api from "./axios";

export const createUser = (data: any) =>
  api.post("/users", data);

export const getUsers = () =>
  api.get("/users");

export const updateUser = (id: string, data: any) =>
  api.put(`/users/${id}`, data);

export const deleteUser = (id: string) =>
  api.delete(`/users/${id}`);

export const searchUsers = (params: any) =>
  api.get("/users/search", { params });
