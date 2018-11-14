import merge from 'lodash/merge';

import { RECEIVE_FORECAST } from '../actions/weather_actions';

const forecastReducer = (state = {}, action) => {
  let newState = {};
  Object.freeze(state);
  switch(action.type) {
    case RECEIVE_FORECAST:
      return merge({}, state, action.forecast);
    default:
      return state;
  }
};

export default forecastReducer;
