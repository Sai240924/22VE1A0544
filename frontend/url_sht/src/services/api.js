import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

console.log("API_URL:", API_URL);

export const shortenUrl = async (originalUrl) => {
  const res = await axios.post(`${API_URL}/shorten`, { originalUrl });
  return res.data;
};

export const fetchAnalytics = async () => {
  const res = await axios.get(`${API_URL}/analytics`);
  return res.data;
};
