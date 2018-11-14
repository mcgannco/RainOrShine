import * as APIUtil from '../util/weather_util';
export const RECEIVE_WEATHER  = 'RECEIVE_WEATHER ';
export const RECEIVE_FORECAST  = 'RECEIVE_FORECAST ';

export const receiveWeather = (weather) => (
  {
    type: RECEIVE_WEATHER,
    weather
  }
);

export const receiveForecast = (forecast) => (
  {
    type: RECEIVE_FORECAST,
    forecast
  }
);

export const requestWeather = (url) => dispatch => {
  return (
    APIUtil.fetchWeather(url).then(weather => (dispatch(receiveWeather(weather)))
    )
  )
}

export const requestForecast = (forecast) => dispatch => {
  return (
    APIUtil.fetchForecast(forecast).then(forecast => (dispatch(receiveForecast(forecast)))
    )
  )
}
