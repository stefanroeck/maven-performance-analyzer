import React from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './App';
import '@fontsource/roboto/400.css';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);
