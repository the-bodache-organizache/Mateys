import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Welcome from '../Welcome';
import { GameRoom } from '../game';
import { Port } from '../port';
import NoMatch from './NoMatch';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Welcome} />
    <Route path="/game/:roomId" component={GameRoom} />
    <Route path="/port" component={Port} />
    <Route component={NoMatch} />
  </Switch>
);

export default Routes;
