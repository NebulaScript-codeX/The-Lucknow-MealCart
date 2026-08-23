import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://the-lucknow-mealcart.onrender.com/api/v1",
  withCredentials: true,
});

export default axiosInstance;
