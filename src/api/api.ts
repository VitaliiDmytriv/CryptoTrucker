import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 2. Server Error Response (status 4xx, 5xx)

    // Check if the error has a response from the server
    if (error.response) {
      const { status, data } = error.response;

      // The server JSON structure: { success: false, message: ..., code: ... }
      // Throw a standardized error object to be caught locally
      const customError = {
        message: data.message || `HTTP Error ${status}`,
        code: data.code || `http-${status}`, // Use the server's 'code' if available
        status: status,
      };

      return Promise.reject(customError); // Reject with our custom error
    } else if (error.request) {
      // 3. Network/Timeout Error (No response received)
      return Promise.reject({
        message: "Network Error: Please check your connection.",
        code: "network-error",
        status: 0,
      });
    }

    // 4. Other Axios errors (e.g., config error)
    return Promise.reject({
      message: error.message,
      code: "client-error",
      status: 0,
    });
  }
);

export default api;
