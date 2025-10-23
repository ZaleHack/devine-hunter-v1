import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import './custom.scss';
import { API_BASE_URL, buildApiPath } from './config';

axios.defaults.baseURL = API_BASE_URL;

const API_ROUTE_PATTERN = /^\s*\/api(?:\/|$)/;

axios.interceptors.request.use((config) => {
  if (typeof config.url === 'string' && API_ROUTE_PATTERN.test(config.url)) {
    const trimmedUrl = config.url.trim();

    if (trimmedUrl === '/api' || trimmedUrl === '/api/') {
      config.url = buildApiPath('');
    } else if (trimmedUrl.startsWith('/api/')) {
      const relativePath = trimmedUrl.slice('/api/'.length);
      config.url = buildApiPath(relativePath);
    }
  }

  return config;
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
