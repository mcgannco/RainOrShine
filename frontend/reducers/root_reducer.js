import { combineReducers } from 'redux';
import weather from './weather_reducer';
import forecast from './forecast_reducer';

const rootReducer = combineReducers({
  weather,
  forecast,
});

export default rootReducer;
