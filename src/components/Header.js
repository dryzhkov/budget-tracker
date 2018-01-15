import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h1>Budget Tracker</h1>
      <nav>
        <ul class="navbar">
          <li><Link to='/'>Budget</Link></li>
          <li><Link to='/summary'>Summary</Link></li>
        </ul>
      </nav>
      <div className="header-bar"></div>
    </header>
  );
};

export default Header;