import { combineReducers } from 'redux';
import weather from './weather_reducer';
import forecast from './forecast_reducer';
import timeZone from './time_zone_reducer';

const rootReducer = combineReducers({
  weather,
  forecast,
  timeZone,
});

export default rootReducer;
