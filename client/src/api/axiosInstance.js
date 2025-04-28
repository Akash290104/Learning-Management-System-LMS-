import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://learning-management-system-lms-q18f.onrender.com"
    : "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const acccessToken = JSON.parse(sessionStorage.getItem("accessToken"));

    if (acccessToken) {
      config.headers.Authorization = `Bearer ${acccessToken}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (err) => {
    console.error("Interceptor request error:", err);
    Promise.reject(err);
  }
);

export default axiosInstance;
