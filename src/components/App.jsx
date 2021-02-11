import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import BudgetList from './BudgetList';
import SummaryPage from './SummaryPage';
import Header from './Header';
import LoginPage from './LoginPage';
import Auth from '../common/Auth';

const App = () => {
  const handleLogout = () => {
    Auth.deauthenticateUser();
    // change the current URL to /
    return <Redirect to="/login" />;
  };

  // if (window.location.pathname !== '/login' && !Auth.isUserAuthenticated()) {
  //   return <Redirect to="/login" />;
  // }

  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={BudgetList} />
        <Route exact path="/summary" component={SummaryPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route path="/logout" component={handleLogout} />
      </Switch>
    </Router>
  );
};

export default App;
