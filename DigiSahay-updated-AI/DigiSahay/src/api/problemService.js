import apiClient from "./apiClient";

export const createProblem = async (problemData) => {
  // Return the full Axios response so callers can inspect `status`
  // 200 = duplicate escalated, 201 = newly created
  const response = await apiClient.post(
    "/api/problems",
    problemData
  );
  return response; // { data, status, headers, ... }
};


export const getAllProblems = async () => {
  const response = await apiClient.get(
    "/api/problems"
  );

  return response.data;
};

export const getProblemById = async (id) => {
  const response = await apiClient.get(
    `/api/problems/${id}`
  );

  return response.data;
};

export const getMyProblems = async () => {
  const response = await apiClient.get(
    "/api/problems/my-problems"
  );

  return response.data;
};
export const getRecommendedProblems = async () => {
  const response = await apiClient.get("/api/problems/recommended");
  return response.data;
};
