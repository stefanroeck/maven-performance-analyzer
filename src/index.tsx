import React from 'react';
import ReactDOM from 'react-dom/client';
import MainApp from './App';
import '@fontsource/roboto/400.css';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';


dayjs.extend(customParseFormat) // custom plugin to allow specifying the date format, see https://day.js.org/docs/en/parse/string-format

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);
