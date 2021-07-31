import * as React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import routeList from '../../../../config/routeMap';
import { ContentPadding, HeaderHeight, SiderCollapsedWidth, SiderWidth } from '../../../../styles';

const { Content } = Layout;

export interface ContentProps extends RouteComponentProps {
    collapsed: boolean;
}

const AppContent: React.FC<ContentProps> = (props) => {
    const { role, location } = props;
    const { pathname } = location;
    const handleFilter = (route) => {
        // return role === 'admin' || !route.roles || route.roles.includes(role);
        return true;
    };
    return (
        <Layout>
            <Content
                style={{
                    marginTop: HeaderHeight,
                    padding: ContentPadding,

                    marginLeft: props.collapsed ? SiderCollapsedWidth : SiderWidth,

                    position: 'static',

                    minHeight: 'calc(100vh - 114px)',
                }}
                className="smooth-transition"
            >
                <div style={{ overflowY: 'scroll' }}>
                    <Switch location={location}>
                        {/* <Redirect exact from="/" to="/dashboard" /> */}
                        {routeList.map((route) => {
                            console.log('route rendering', route);
                            return (
                                // handleFilter(route) && (
                                <Route component={route.component} key={route.path} path={route.path} />
                                // )
                            );
                        })}
                        <Redirect to="/error/404" />
                    </Switch>
                </div>
            </Content>
        </Layout>
    );
};

export default AppContent;
