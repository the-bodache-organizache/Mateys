import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <div className="navbar">
    <Link to="/">
      <img id="logo" src="/mateys.png" />
    </Link>
  </div>
);

export default Navbar;
