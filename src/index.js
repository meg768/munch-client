import './fontello/css/fontello-embedded.css';
import 'bootswatch/dist/materia/bootstrap.min.css';
//import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

registerServiceWorker();

ReactDOM.render(<App />, document.getElementById('app'));
