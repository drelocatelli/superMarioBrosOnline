import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router'
import { store } from './store/storeConfig';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( 
    <Provider store={store}>
        <Router />
    </Provider>
 );

