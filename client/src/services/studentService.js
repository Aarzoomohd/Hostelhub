import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createStudent = async (studentData, token) => {
  const response = await axios.post(`${API_URL}/api/student`, studentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getStudents = async (token) => {
  const response = await axios.get(`${API_URL}/api/student`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateStudent = async (id, studentData, token) => {
  const response = await axios.put(
    `${API_URL}/api/student/${id}`,
    studentData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const deleteStudent = async (id, token) => {
  const response = await axios.delete(`${API_URL}/api/student/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};