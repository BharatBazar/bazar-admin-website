import * as React from 'react';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import './Header.css';
import { HeaderHeight, SiderCollapsedWidth, SiderWidth } from '../../../../constants';

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
                height: HeaderHeight,
                marginLeft: collapsed ? SiderCollapsedWidth : SiderWidth,
                position: 'fixed',
                paddingLeft: '2%',
                alignItems: 'center',
                width: '100vw',
                backgroundColor: '#FFFFFF',
            }}
        >
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger sider-button',
                onClick: handleToggle,
                style: { color: '#000' },
            })}
        </Header>
    );
};

export default AppHeader;
