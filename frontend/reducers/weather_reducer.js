import merge from 'lodash/merge';

import { RECEIVE_WEATHER } from '../actions/weather_actions';

const weatherReducer = (state = {}, action) => {
  let newState = {};
  Object.freeze(state);
  switch(action.type) {
    case RECEIVE_WEATHER:
      return merge({}, state, action.weather);
    default:
      return state;
  }
};

export default weatherReducer;
