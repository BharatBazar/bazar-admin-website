import * as React from 'react';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';

const { Header } = Layout;

export interface HeaderProps {
    collapsed: boolean;
    handleToggle: React.MouseEventHandler<HTMLSpanElement>;
}

const AppHeader: React.SFC<HeaderProps> = ({ collapsed, handleToggle }) => {
    return (
        <Header
            className="siteLayoutBackground smooth-transition"
            style={{
                padding: 0,
                height: '10vh',
                marginLeft: collapsed ? '8vw' : '20vw',
                position: 'fixed',

                width: '100vw',
            }}
        >
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: handleToggle,
                style: { color: '#fff' },
            })}
        </Header>
    );
};

export default AppHeader;
