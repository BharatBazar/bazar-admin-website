import * as React from 'react';
import { Card } from 'antd';
import './Login.css';

export interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
    return (
        <div className="login">
            <Card title={'Login Page'} />
        </div>
    );
};

export default Login;
