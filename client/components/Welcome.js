import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div id="welcome">
      <Link to='/game'>
        <h1>Game Room</h1>
      </Link>
    </div>
  );
};

export default Welcome;
