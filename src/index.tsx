import ReactDOM from 'react-dom';

import './style.css';

import { App } from './App';

if (!window.Worker) {
  throw new Error('This browser does not support web workers');
}

(async () => {
  const myWorker = new Worker('worker.js');

  myWorker.onmessage = (e) => {
    console.log('result ' + e.data);
  };

  myWorker.postMessage({ x: 1, y: 3 });

  await new Promise((r) => setTimeout(r, 500));

  console.log('terminating worker');
  myWorker.terminate();
})();

ReactDOM.render(<App />, document.getElementById('app'));
