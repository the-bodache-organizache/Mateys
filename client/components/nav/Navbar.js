import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLink, Logout } from '../auth';
import { VideoFeed, MotionDetection } from '../test';

const Navbar = () => (
  <nav className="row center-y">
    <Link to="/">
      <img id="logo" src="/favicon.ico" />
    </Link>
    <Link to='/videofeed'>
      Video Feed
    </Link>
    <Link to='/motiondetection'>
      Motion Detection
    </Link>
    <AuthLink to="/login" guestsOnly>
      Login
    </AuthLink>
    <AuthLink to="/signup" guestsOnly>
      Signup
    </AuthLink>
    <AuthLink to="/home">Home</AuthLink>
    <AuthLink to="/members" adminsOnly>
      Members
    </AuthLink>
    <AuthLink to="/">
      <Logout />
    </AuthLink>
  </nav>
);

export default Navbar;
