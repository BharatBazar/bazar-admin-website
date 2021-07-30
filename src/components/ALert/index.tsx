import { message } from 'antd';

export const success = (messagetoshow) => {
    message.success(messagetoshow);
};

export const errorShow = (messagetoshow) => {
    message.error(messagetoshow);
};

export const warning = (messagetoshow) => {
    message.warning(messagetoshow);
};
