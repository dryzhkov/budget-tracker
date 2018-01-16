import React from 'react';
import { Route, Switch } from 'react-router';
import BudgetList from './BudgetList';
import Summary from './Summary';
import Header from './Header';
import LoginPage from './LoginPage';

const App = () => {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={BudgetList} />
        <Route path="/summary/:year" component={Summary} />
        <Route path="/login" component={LoginPage} />
      </Switch>
    </div>
  );
};

export default App;
