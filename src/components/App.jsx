import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import BudgetList from './BudgetList';
import Summary from './Summary';
import Header from './Header';
import LoginPage from './LoginPage';
import Auth from '../common/Auth';

const App = () => {
  const handleLogout = () => {
    Auth.deauthenticateUser();
    // change the current URL to /
    return <Redirect to="/login" />;
  };

  if (window.location.pathname !== '/login' && !Auth.isUserAuthenticated()) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={BudgetList} />
        <Route path="/summary/:year" component={Summary} />
        <Route path="/login" component={LoginPage} />
        <Route path="/logout" component={handleLogout} />
      </Switch>
    </div>
  );
};

export default App;
