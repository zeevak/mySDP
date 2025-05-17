// main.jsx
// this is to render the app in the browser
import React from 'react';
import ReactDOM from 'react-dom/client'; // <-- correct for React 18
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
