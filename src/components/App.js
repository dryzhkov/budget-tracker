import React from 'react';
import { Route, Switch } from 'react-router';
import logo from '../assets/logo.svg';
import './App.css';
import BudgetList from './BudgetList';
import Summary from './Summary';
import Header from './Header';

const App = () => {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={BudgetList} />
        <Route path="/summary/:year" component={Summary} />
      </Switch>
    </div>
  );
};

export default App;
