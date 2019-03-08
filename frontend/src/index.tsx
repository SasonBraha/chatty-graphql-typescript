import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import './base.css';

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById('reactMount')
);
serviceWorker.unregister();
