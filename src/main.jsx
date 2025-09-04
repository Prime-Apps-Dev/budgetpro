// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AppContextProvider } from './context/AppContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import 'virtual:pwa-register' // Добавляем эту строку для регистрации PWA

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);