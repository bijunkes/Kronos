import React from 'react';
import ReactDOM from 'react-dom/client';

import MyGlobalStyles from './styles/globalStyles.js';
import App from './app';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MyGlobalStyles />
        <App />
    </React.StrictMode>
)