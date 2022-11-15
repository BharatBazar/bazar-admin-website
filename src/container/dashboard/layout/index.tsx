import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import './layout.css';
import { RouteComponentProps } from 'react-router-dom';
import AppSider from './sider/Sider';
import AppHeader from './header/header';
import AppContent from './content/Content';

interface MainLayoutProps extends RouteComponentProps {}

const MainLayout: React.FC<MainLayoutProps> = (props) => {
    console.log('mainLayout =>', props);
    const [collapsed, setcollapsed] = useState(false);

    useEffect(() => {
        window.innerWidth <= 760 ? setcollapsed(true) : setcollapsed(false);
    }, []);

    const handleToggle = (event: any) => {
        event.preventDefault();
        collapsed ? setcollapsed(false) : setcollapsed(true);
    };

    return (
        <Layout className="smooth-transition">
            <AppSider collapsed={collapsed} {...props} />
            <AppHeader collapsed={collapsed} handleToggle={handleToggle} />
            <AppContent collapsed={collapsed} {...props} />
        </Layout>
    );
};
export default MainLayout;
