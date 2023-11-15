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
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("jwtToken");
            window.location.href = '/';
        } else {
            return Promise.reject(error);
        }
    }
);

export default instance;