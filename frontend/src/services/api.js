import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

console.log("API_BASE_URL:", API_BASE_URL);

export const shortenUrl = async (urls) => {
  const response = await axios.post(`${API_BASE_URL}/shorten`, { urls });
  return response.data;
};

export const fetchAnalytics = async () => {
  const response = await axios.get(`${API_BASE_URL}/analytics`);
  return response.data;
};
