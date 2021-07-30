import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from '../container/auth/Login';

export interface AppRouterProps {}

const AppRouter: React.SFC<AppRouterProps> = () => (
    <BrowserRouter>
        <Switch>
            <Route component={Login} path={'/'} />
        </Switch>
    </BrowserRouter>
);

export default AppRouter;
