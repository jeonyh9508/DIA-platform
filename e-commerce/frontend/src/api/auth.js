import api from "./axiosConfig";

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/api/auth/current-user");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  const response = await api.post("/login", { email, password });
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/logout");
  return response.data;
};
