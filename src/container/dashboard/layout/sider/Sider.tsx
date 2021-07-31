import * as React from 'react';
import { Layout } from 'antd';
import Menu from './menu';
import SiderHeader from './header/SiderHeader';
import { RouteComponentProps } from 'react-router-dom';

const { Sider } = Layout;

export interface AppSiderProps extends RouteComponentProps {
    collapsed: boolean;
}

const AppSider: React.SFC<AppSiderProps> = ({ collapsed, ...rest }) => {
    return (
        <Sider
            trigger={null}
            className="smooth-transition"
            collapsible
            collapsed={collapsed}
            collapsedWidth={'8vw'}
            width={'20vw'}
            style={{
                // overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                backgroundColor: '#FFFFFF',
                width: '20vw',
            }}
        >
            <SiderHeader />
            <Menu {...rest} />
        </Sider>
    );
};

export default AppSider;
