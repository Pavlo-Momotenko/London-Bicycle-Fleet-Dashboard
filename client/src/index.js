import React from 'react';
import ReactDOM from 'react-dom/client';

import {BrowserRouter} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));

// Remove comments on StrictMode if the client on production and build with npm build
root.render(
    // <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    // </React.StrictMode>
);
