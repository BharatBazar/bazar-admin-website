import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from '../container/auth/Login';
import MainLayout from '../container/dashboard/layout';

export interface AppRouterProps {}

const AppRouter: React.SFC<AppRouterProps> = () => (
    <BrowserRouter>
        <Switch>
            <Route component={MainLayout} path={'/'} />
            <Route component={Login} path={'/login'} />
        </Switch>
    </BrowserRouter>
);

export default AppRouter;
