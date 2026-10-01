import axios from 'axios';

// Get base URL from Vite environment variable with local fallback
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/students';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStudentsApi = async () => {
  const response = await api.get('/');
  return response.data;
};

export const getStudentByIdApi = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const createStudentApi = async (studentData) => {
  const response = await api.post('/', studentData);
  return response.data;
};

export const updateStudentApi = async (id, studentData) => {
  const response = await api.put(`/${id}`, studentData);
  return response.data;
};

export const deleteStudentApi = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

export default api;
