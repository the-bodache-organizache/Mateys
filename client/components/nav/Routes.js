import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthRoute, Login, Signup } from '../auth';
import Welcome from '../Welcome';
import { Home } from '../user';
import { MembersList } from '../members';
import { MotionDetection, VideoFeed } from '../test';
import NoMatch from './NoMatch';

const Routes = () => (
  <div className="fill-xy center-xy column">
    <Switch>
      <Route exact path='/' component={Welcome} />
      <Route path='/login' component={Login} />
      <Route path='/signup' component={Signup} />
      <Route path='/motiondetection' component={ MotionDetection } />
      <Route path='/videofeed' component={ VideoFeed } />
      <AuthRoute path='/home' component={Home} />
      <AuthRoute path='/members' component={MembersList} adminsOnly />
      <Route component={NoMatch} />
    </Switch>
  </div>
);

export default Routes;
