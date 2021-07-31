import * as React from 'react';
import { Layout } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import Menu from './menu';

import SiderHeader from './header/SiderHeader';
import { SiderCollapsedWidth, SiderWidth } from '../../../../styles';

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
            translate={'yes'}
            collapsed={collapsed}
            collapsedWidth={SiderCollapsedWidth}
            width={SiderWidth}
            style={{
                // overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                backgroundColor: '#FFFFFF',
            }}
        >
            <SiderHeader />
            <Menu {...rest} />
        </Sider>
    );
};

export default AppSider;
