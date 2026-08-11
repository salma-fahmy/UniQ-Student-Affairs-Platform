import api from './api';

const getResponseData = (response) => response?.data?.data ?? response?.data ?? {};

export const fetchCollageStats = async () => {
  const response = await api.get('/collageInfo/stats');

  return getResponseData(response);
};