import * as React from 'react';
import { Layout } from 'antd';

const { Sider } = Layout;

export interface AppSiderProps {
    collapsed: boolean;
}

const AppSider: React.SFC<AppSiderProps> = ({ collapsed }) => {
    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, backgroundColor: '#FFFFFF' }}
        />
    );
};

export default AppSider;
