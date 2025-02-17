import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});


axiosInstance.interceptors.request.use(
  (config) => {
    const acccessToken = JSON.parse(sessionStorage.getItem("accessToken"));

    if (acccessToken) {
      config.headers.Authorization = `Bearer ${acccessToken}`;
    }
    else {
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
