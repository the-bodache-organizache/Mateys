import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthRoute, Login, Signup } from '../auth';
import Welcome from '../Welcome';
import { Home } from '../user';
import { MembersList } from '../members';
import { GameRoom } from '../game';
import NoMatch from './NoMatch';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Welcome} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/game" component={GameRoom} />
    <AuthRoute path="/home" component={Home} />
    <AuthRoute path="/members" component={MembersList} adminsOnly />
    <Route component={NoMatch} />
  </Switch>
);

export default Routes;
