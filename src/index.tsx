import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './UI/css/Polished.scss'
import App from './App';
import reportWebVitals from './reportWebVitals';
import Engine from './engine/Engine';

export const gEngine = new Engine();

ReactDOM.render(
  <React.StrictMode>
    <App engine={gEngine} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
