import { message } from 'antd';
import { success } from './../components/ALert/index';
import axios from 'axios';

export const apiEndPoint = 'http://localhost:2112';

const handleError = (error: { isAxiosError: any; response: { data: any } }) => {
    let message = '';

    const { data } = error.response;
    message = data.message;

    return Promise.reject({ message });
};

function isNetworkError(err: { isAxiosError: any; response: { data: any } }) {
    return !!err.isAxiosError && !err.response;
}

export function setUpAxios() {
    axios.defaults.baseURL = apiEndPoint;
    console.log('axios', axios.interceptors.response);
    if (axios.interceptors.response.handlers.length == 0) {
        axios.interceptors.response.use(
            (response) => {
                console.log('Response sucess', success);
                return response.data;
            },
            (error) => {
                console.log('error => ', error.response);
                if (isNetworkError(error)) {
                    const message = 'Network Error';
                    return Promise.reject({ message });
                } else {
                    return handleError(error);
                }
            },
        );
    }
}
