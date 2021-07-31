import axios from 'axios';

export const apiEndPoint = 'http://localhost:2112';

const handleError = (error: { isAxiosError: any; response: { data: any } }) => {
    let message = '';
    if (error.response) {
        const { data } = error.response;
        message = data;
    } else {
        message = error.message;
    }
    return Promise.reject({ message });
};

function isNetworkError(err: { isAxiosError: any; response: { data: any } }) {
    return !!err.isAxiosError && !err.response;
}

export function setUpAxios() {
    axios.defaults.baseURL = apiEndPoint;
    axios.interceptors.response.use(
        (response) => {
            return response.data;
        },
        (error) => {
            if (isNetworkError(error)) {
                const message = 'Network Error';
                return Promise.reject({ message });
            }
            return handleError(error);
        },
    );
}
