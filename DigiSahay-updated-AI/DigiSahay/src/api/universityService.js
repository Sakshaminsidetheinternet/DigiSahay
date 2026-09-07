import apiClient from "./apiClient";

export const getUniversityProfile = async () => {
  const response = await apiClient.get("/api/university/profile");
  return response.data;
};

export const updateUniversityProfile = async (profileData) => {
  const response = await apiClient.put("/api/university/profile", profileData);
  return response.data;
};
