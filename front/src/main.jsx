
import React from 'react';
import ReactDOM from 'react-dom/client';

import MyGlobalStyles from './styles/globalStyles.js';
import App from './app';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MyGlobalStyles />
    <App />
    <Toaster 
      position="top-center"
      containerStyle={{ marginTop: '20px', zIndex: 2147483647 }}
      toastOptions={{
        duration: 10000,
        style: {
          fontSize: '14px',
          borderRadius: '10px',
          padding: '12px 16px',
        },
      }}
    />
  </React.StrictMode>
);
