//creating api ,then to check if the token exists is valid or not

import axios from "axios";
import { showErrorAlert } from "../utils/sweetAlert.js";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

//Attach the stored token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Clear a stale token if the server rejects it
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    const responseData = error.response?.data;
    const responseContentType = error.response?.headers?.["content-type"] || "";
    const isHtmlResponse =
      responseContentType.includes("text/html") ||
      (typeof responseData === "string" && /<\s*!doctype\s+html|<\s*html\b/i.test(responseData));
    const responseMessage =
      typeof responseData === "string"
        ? responseData
        : typeof responseData?.message === "string"
          ? responseData.message
          : "";
    const validationMessages = Array.isArray(responseData?.errors)
      ? responseData.errors.filter((message) => typeof message === "string")
      : [];
    const message = isHtmlResponse
      ? `The API returned an HTML page for ${error.config?.url || "this request"}. Check that backend route.`
      : [responseMessage, ...validationMessages]
          .filter(Boolean)
          .join(": ") || error.message || "The request could not be completed.";

    const status = error.response?.status;
    const title =
      status === 400
        ? "Check your details"
        : status === 401
          ? "Authentication failed"
          : status === 403
            ? "Access denied"
            : status === 404
              ? "Not found"
              : status === 409
                ? "Already exists"
                : status === 429
                  ? "Too many attempts"
                  : status >= 500
                    ? "Server error"
                    : "Request failed";

    void showErrorAlert(message, title);
    return Promise.reject(error);
  },
);

export default api;
