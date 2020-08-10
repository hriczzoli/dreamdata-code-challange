import React, { useEffect } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Header from '../components/Header';
import Events from '../components/TrafficEvents/index';
import Transit from '../components/Transit/index';

export const history = createBrowserHistory();

const AppRouter = () => {
    return (
        <Router history={history}>
            <div>
                <Header history={history}/>
                <Switch>
                    <Route path="/" component={Events} exact={true} />
                    <Route path="/transit" component={Transit} />
                </Switch>
            </div>
        </Router>
    )
}

export default AppRouter;