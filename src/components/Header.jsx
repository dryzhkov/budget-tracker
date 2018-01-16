import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentPayDate } from '../common/Utils';

const Header = () => {
  const currentYear = getCurrentPayDate().year;
  return (
    <header>
      <h1>Budget Tracker</h1>
      <nav>
        <ul className="navbar">
          <li><Link to='/'>Budget</Link></li>
          <li><Link to={'/summary/' + currentYear}>Summary</Link></li>
        </ul>
      </nav>
      <div className="header-bar"></div>
    </header>
  );
};

export default Header;