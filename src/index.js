import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

ReactDOM.render(
  <App
    googleAppId={document.currentScript.getAttribute('googleAppId')}
    linkedinAppId={document.currentScript.getAttribute('linkedinAppId')}
  />,
  document.getElementById('content')
);
