import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Calendar from './components/Calendar';
import registerServiceWorker from './registerServiceWorker';

let fontAwesomeScript = document.createElement("script");
fontAwesomeScript.type = "text/javascript";
fontAwesomeScript.src = "https://use.fontawesome.com/d7e1a1ef0b.js";
document.head.appendChild(fontAwesomeScript);

ReactDOM.render(<Calendar />, document.getElementById('root'));
registerServiceWorker();
