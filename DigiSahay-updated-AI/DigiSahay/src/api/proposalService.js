import apiClient from "./apiClient";

export const createUniversityProposal = async ({ universityId, problemId, solutionTitle, mentor, studentTeam, trlLevel, fundingRequired, pdfFile }) => {
  const formData = new FormData();
  formData.append("universityId", universityId);
  formData.append("problemId", problemId);
  formData.append("solutionTitle", solutionTitle);
  if (mentor) formData.append("mentor", mentor);
  if (studentTeam) formData.append("studentTeam", studentTeam);
  if (trlLevel) formData.append("trlLevel", trlLevel);
  if (fundingRequired) formData.append("fundingRequired", fundingRequired);
  if (pdfFile instanceof File) formData.append("pdf", pdfFile);
  const response = await apiClient.post("/api/proposals/university", formData);
  return response.data;
};

export const getUniversityProposals = async (universityId) => {
  const response = await apiClient.get(`/api/proposals/university/${universityId}`);
  return response.data;
};

export const getAllProposals = async () => {
  const response = await apiClient.get("/api/proposals");
  return response.data;
};
