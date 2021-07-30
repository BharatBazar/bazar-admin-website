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
                    marginTop: '114px',
                    marginLeft: collapsed ? '5vw' : '10vw',
                    padding: 24,

                    position: 'static',
                    height: '100%',
                    // minHeight: 'calc(100vh - 114px)',
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
