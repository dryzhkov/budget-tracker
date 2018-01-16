import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './index.css';
import App from './components/App';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

setupGlobals();

const ThemedApp = () => (
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MuiThemeProvider>
);

ReactDOM.render(<ThemedApp />, document.getElementById('root'));
registerServiceWorker();

function setupGlobals() {
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
