import merge from 'lodash/merge';

import { RECEIVE_TIME_ZONE } from '../actions/weather_actions';

const timeZoneReducer = (state = {}, action) => {
  let newState = {};
  Object.freeze(state);
  switch(action.type) {
    case RECEIVE_TIME_ZONE:
      return merge({}, state, action.timeZone);
    default:
      return state;
  }
};

export default timeZoneReducer;
