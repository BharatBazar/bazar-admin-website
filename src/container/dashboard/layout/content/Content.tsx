import * as React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

export interface ContentProps {
    collapsed: boolean;
}

const AppContent: React.SFC<ContentProps> = ({ collapsed }) => {
    return (
        <Layout>
            <Content
                style={{
                    marginTop: '11vh',
                    marginLeft: collapsed ? '8vw' : '20vw',
                    padding: 24,

                    position: 'static',

                    minHeight: 'calc(100vh - 114px)',
                    backgroundColor: 'aliceblue',
                }}
                className="smooth-transition"
            >
                <div style={{ overflowY: 'scroll' }} />
            </Content>
        </Layout>
    );
};

export default AppContent;
