import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div id="welcome">
      <Link to='/lobby'>
        <h1>Lobby</h1>
      </Link>
    </div>
  );
};

export default Welcome;
