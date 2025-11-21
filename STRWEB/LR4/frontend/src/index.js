import React from 'react';
import ReactDOM from 'react-dom/client';
import ExportApp from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ExportApp />
  </React.StrictMode>
);

reportWebVitals();