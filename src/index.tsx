import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/roboto/400.css';
import { MemoryAnalyzerApp } from './MemoryAnalyzerApp';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MemoryAnalyzerApp />
  </React.StrictMode>
);
