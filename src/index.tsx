import React from 'react';
import Deck from './Deck';
import ReactDOM from 'react-dom';
import FILES from '../slides/**/*.dy';
import './index.css';

ReactDOM.render(
  <Deck files={FILES} header="etienne-dldc/talk-type-safe-api" />,
  document.getElementById('root')
);
