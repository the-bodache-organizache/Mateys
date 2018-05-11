import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Welcome from '../Welcome';
import { Home } from '../user';
import { GameRoom, Lobby } from '../game';
import NoMatch from './NoMatch';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Welcome} />
    <Route path="/game" component={GameRoom} />
    <Route path="/lobby" component={Lobby} />
    <Route component={NoMatch} />
  </Switch>
);

export default Routes;
