import apiClient from "./apiClient";

export const registerUser = async (userData) => {
  const response = await apiClient.post(
    "/api/users/register",
    userData
  );

  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await apiClient.post(
    "/api/users/login",
    loginData
  );

  return response.data;
};

export const getProfile = async () => {
  const response = await apiClient.get(
    "/api/users/profile"
  );

  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await apiClient.put(
    "/api/users/profile",
    profileData
  );

  return response.data;
};