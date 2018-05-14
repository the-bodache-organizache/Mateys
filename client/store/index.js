import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunks from 'redux-thunk';
import axios from 'axios';
import history from '../history';
import widgets from './widgets';
import commands from './commands';
import connection from './connection';
import motionDetection from './motionDetection';
import gameStatus from './game-status';
import rooms from './rooms';
import myRoom from './myRoom';

const reducer = combineReducers({ widgets, motionDetection, commands, connection, gameStatus, rooms, myRoom });

const store = createStore(
  reducer,
  applyMiddleware(thunks.withExtraArgument({ axios, history }))
);

export default store;
