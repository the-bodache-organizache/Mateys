import React from 'react';
import { Link } from 'react-router-dom';

const NoMatch = () => (
  <h3>
    We don't know where you're from, but around here, you need to
    go through the <Link to="/port">port</Link> before you can board a ship
  </h3>
);

export default NoMatch;
