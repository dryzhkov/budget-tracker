import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BudgetList from './components/BudgetList';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Budget Tracker</h1>
        <div className="header-bar"></div>
        <BudgetList />
      </div>
    );
  }
}

export default App;
