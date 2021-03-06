import axios from "axios";

const apiUrl =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3030/api";

const axiosOptions = { baseURL: apiUrl };
const axiosInstance = axios.create(axiosOptions);
export default axiosInstance;
