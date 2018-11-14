import { connect } from 'react-redux';
import { requestWeather,requestForecast } from '../../actions/weather_actions';

import Home from './home';

const msp = state => {
  return({
    weather: state.weather,
    forecast: state.forecast,
  })
};

const mdp = dispatch => {
  return({
    requestWeather: (url) => dispatch(requestWeather(url)),
    requestForecast: (forecast) => dispatch(requestForecast(forecast)),
  })
};

export default connect(msp, mdp)(Home);
