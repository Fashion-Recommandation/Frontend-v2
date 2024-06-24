import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://46.249.98.145:8000', // Make sure this is the correct URL of your Django server
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async config => {
        const token = document.cookie.split('csrftoken=')[1];
        if (token) {
            config.headers['X-CSRFToken'] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
