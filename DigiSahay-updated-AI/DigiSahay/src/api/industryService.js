import apiClient from "./apiClient";
export const getIndustryProfile = async () => (await apiClient.get("/api/industry/profile")).data;
export const updateIndustryProfile = async (data) => (await apiClient.put("/api/industry/profile", data)).data;
