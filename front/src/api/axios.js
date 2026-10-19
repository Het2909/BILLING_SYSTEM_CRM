import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

API.interceptors.request.use(
  async (req) => {

    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const refresh = localStorage.getItem("refresh");

        if (!refresh) {
          throw new Error("Missing refresh token");
        }

        const response = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          {
            refresh,
          }
        );

        localStorage.setItem(
          "token",
          response.data.access
        );

        originalRequest.headers.Authorization =
          `Bearer ${response.data.access}`;

        return API(originalRequest);

      } catch (err) {

        localStorage.clear();

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
