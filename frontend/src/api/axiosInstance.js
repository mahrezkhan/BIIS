import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5050/api', // backend base path
  withCredentials: true // include cookies (if any)
});

export default axiosInstance;
