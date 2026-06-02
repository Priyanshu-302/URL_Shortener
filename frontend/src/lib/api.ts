import axios from "axios";

const api = axios.create({
  baseURL: "https://url-shortener-backend-mztz.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken: string | null = null;
let logoutCallback: (() => void) | null = null;
let setAccessTokenCallback: ((token: string | null) => void) | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const registerAuthCallbacks = (
  logout: () => void,
  setToken: (token: string | null) => void
) => {
  logoutCallback = logout;
  setAccessTokenCallback = setToken;
};

// Request interceptor to attach bearer token
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Trigger token refresh on 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        if (logoutCallback) logoutCallback();
        return Promise.reject(error);
      }

      try {
        // Direct call to avoid auth headers and interceptor loops
        const response = await axios.post("https://url-shortener-backend-mztz.onrender.com/api/auth/refresh-token", {
          refreshToken,
        });

        // The endpoint returns data in { statusCode, success, message, data: { accessToken } }
        // Let's inspect auth controller's return schema:
        // return res.json(new ApiResponse(200, { accessToken: newAccessToken }, ...))
        // So it is response.data.data.accessToken
        const newAccessToken = response.data?.data?.accessToken;
        
        if (!newAccessToken) {
          throw new Error("No access token returned from refresh request");
        }

        // Update context and local tracker
        if (setAccessTokenCallback) {
          setAccessTokenCallback(newAccessToken);
        }
        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (logoutCallback) logoutCallback();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
