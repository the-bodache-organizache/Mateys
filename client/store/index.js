import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunks from 'redux-thunk';
import axios from 'axios';
import history from '../history';
import user from './user';
import members from './members';
import widgets from './widgets';
import commands from './commands';
import connection from './connection';
import motionDetection from './motionDetection';
import gameStatus from './game-status';
import rooms from './rooms';

const reducer = combineReducers({ user, members, widgets, motionDetection, commands, connection, gameStatus, rooms });

const store = createStore(
  reducer,
  applyMiddleware(thunks.withExtraArgument({ axios, history }))
);

export default store;
