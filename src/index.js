import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

setup();
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

function setup() {
  /**
   * Number.prototype.format(n, x)
   * 
   * @param integer n: length of decimal
   * @param integer x: length of sections
   */
  Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
  };
}
