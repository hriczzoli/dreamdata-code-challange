import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import './tailwind.output.css';
import * as serviceWorker from './serviceWorker';
import { ToastProvider } from 'react-toast-notifications'

import AppRouter from './routers/AppRouter';
require('dotenv').config()

ReactDOM.render(
  <ToastProvider
    placement="top-center"
    autoDismiss={true}
  >
    <AppRouter />
  </ToastProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
