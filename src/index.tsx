import ReactDOM from 'react-dom';

import './style.css';

import { App } from './App';

if (!window.Worker) {
  throw new Error('This browser does not support web workers');
}

ReactDOM.render(<App />, document.getElementById('app'));
