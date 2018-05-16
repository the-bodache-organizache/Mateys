import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div id="welcome">
      <Link to='/port'>
        <h1>Port</h1>
      </Link>
    </div>
  );
};

export default Welcome;
