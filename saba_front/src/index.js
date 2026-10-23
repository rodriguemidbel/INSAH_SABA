// import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter } from 'react-router-dom';
// import App from './app/App';
// import "./i18n";
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(
//   // <BrowserRouter basename="/demo/corona-react-free/template/demo_1/preview">
//   <BrowserRouter basename="project-saba/frontend/saba">
//     <App />
//   </BrowserRouter>
// , document.getElementById('root'));

// serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import './i18n';
import * as serviceWorker from './serviceWorker';

ReactDOM.render( <BrowserRouter> <App /> </BrowserRouter>,
document.getElementById('root')
);

serviceWorker.unregister();
