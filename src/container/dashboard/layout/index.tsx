import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import './layout.css';
import AppSider from './sider/Sider';
import AppHeader from './header/Header';
import AppContent from './content/Content';

const MainLayout = () => {
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
            <AppSider collapsed={collapsed} />
            <AppHeader collapsed={collapsed} handleToggle={handleToggle} />
            <AppContent collapsed={collapsed} />
        </Layout>
    );
};
export default MainLayout;
