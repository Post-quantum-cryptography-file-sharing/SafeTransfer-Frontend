import axios, {type AxiosError} from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
        if (error.response?.status === 401 && !isAuthPage) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
