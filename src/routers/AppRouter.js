import React, { useEffect } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Header from '../components/Header';
import Events from '../components/TrafficEvents/index';
import Dashboard from '../components/Dashboard';

export const history = createBrowserHistory();

const AppRouter = () => {
    return (
        <Router history={history}>
            <div>
                <Header history={history}/>
                <Switch>
                    <Route path="/" component={Events} exact={true} />
                    <Route path="/dashboard" component={Dashboard} />
                </Switch>
            </div>
        </Router>
    )
}

export default AppRouter;