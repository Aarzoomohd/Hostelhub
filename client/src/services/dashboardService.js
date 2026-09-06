import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getDashboardStats = async (token) => {
  const response = await axios.get(`${API_URL}/api/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};