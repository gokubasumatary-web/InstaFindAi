import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

// Parse natural language query to structured parameters
api.parseQuery = async (query: string) => {
  const response = await api.post("/parse-query", { query });
  return response.data;
};

// Search accounts with filters
api.searchAccounts = async (filters: any) => {
  const response = await api.post("/search", { filters });
  return response.data;
};

export default api;