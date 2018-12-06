import { connect } from 'react-redux';
import { requestWeather,requestForecast, requestTimeZone } from '../../actions/weather_actions';

import Home from './home';

const msp = state => {
  return({
    weather: state.weather,
    forecast: state.forecast,
    timeZone: state.timeZone,
  })
};

const mdp = dispatch => {
  return({
    requestWeather: (url) => dispatch(requestWeather(url)),
    requestForecast: (forecast) => dispatch(requestForecast(forecast)),
    requestTimeZone: (url) => dispatch(requestTimeZone(url)),
  })
};

export default connect(msp, mdp)(Home);
