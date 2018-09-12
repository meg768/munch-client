import './fontello/css/fontello-embedded.css';
import './bootstrap/darkly/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

registerServiceWorker();

ReactDOM.render(<App />, document.getElementById('app'));
