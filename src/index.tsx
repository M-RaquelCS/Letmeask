import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './services/firebase'; // código da aula = #together
import './styles/global.scss'; // código da sass

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
