import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { NotificationProvider } from './context/NotificationContext';
import App from './App';
import store from './store';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <NotificationProvider>
          <App />
          <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </NotificationProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);