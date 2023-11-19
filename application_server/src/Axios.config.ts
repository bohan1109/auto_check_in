import axios from 'axios';
const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,

    headers: {
        'Content-Type': 'application/json'
    },

    timeout: 11000
});
instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const status = error.response.status;
            const isLoginRequest = error.config.headers['isLoginRequest'];

            if (status === 401 && !isLoginRequest) {
                localStorage.removeItem("jwtToken");
                window.location.href = '/';
            }
        }

        return Promise.reject(error);
    }
);

export default instance;