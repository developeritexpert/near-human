import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";

interface ApiResponse {
  message?: string;
  desc?: string;
  [key: string]: any;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { config, data } = response;
    const method = config.method?.toLowerCase();

    if (method && ["post", "put", "delete", "patch"].includes(method)) {
      const message =
        data?.message || data?.desc || "Operation completed successfully";
      if (message) {
        toast.success(message);
      }
    }

    return response;
  },
  (error) => {
    let errorMessage = "An unexpected error occurred";

    if (axios.isAxiosError(error)) {
      const data = error.response?.data as ApiResponse;

      if (error.response?.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.clear();
        }
        errorMessage = "Session expired. Please login again.";
      } else {
        errorMessage =
          data?.message || data?.desc || error.message || errorMessage;
      }
    }

    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

const apiWrapper = async <T = any>(
  method: "get" | "post" | "put" | "delete" | "patch",
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api({
      method,
      url,
      ...(method === "get" ? { params: data } : { data }),
      ...config,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiWrapper;
export { api };
