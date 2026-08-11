import api from './api';

/**
 * Fetch college general info
 * GET /api/v1/collageInfo
 */
export const getCollegeInfo = async () => {
  const response = await api.get('/collageInfo');
  return response.data.data;
};

/**
 * Fetch college stats (studentNumber, facultyNumber, facultyServices)
 * GET /api/v1/collageInfo/stats
 */
export const getCollegeStats = async () => {
  const response = await api.get('/collageInfo/stats');
  return response.data.data;
};

/**
 * Fetch all programs (summary list)
 * GET /api/v1/programs
 */
export const getAllPrograms = async () => {
  const response = await api.get('/programs');
  return response.data.data;
};

/**
 * Fetch a single program's full details
 * GET /api/v1/programs/:id
 * @param {number} programId
 */
export const getProgramById = async (programId) => {
  const response = await api.get(`/programs/${programId}`);
  return response.data.data;
};