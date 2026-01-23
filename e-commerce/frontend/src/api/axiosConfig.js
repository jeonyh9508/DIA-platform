import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:9090",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, config } = error.response;

      const isAuthRequest =
        config.url.endsWith("/login") || config.url.endsWith("/logout");
      const isCurrentUserRequest = config.url.endsWith(
        "/api/auth/current-user"
      );

      if (status === 401 && !isAuthRequest && !isCurrentUserRequest) {
        toast('세션이 만료되었거나, 인증되지 않았습니다. 다시 로그인해주세요.');
        window.location.href = '/';
      } else if (status === 403) {
        toast('이 페이지에 접근할 권한이 없습니다.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
