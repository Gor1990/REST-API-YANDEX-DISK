import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import token from './token';
import directory from './directory';

export default combineReducers({
  token: token,
  currentDirectory: directory,
  routing: routerReducer,
});
