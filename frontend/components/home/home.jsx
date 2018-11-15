import React from 'react';

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      weather: null,
      forecast: null,
      temp: "far"
    }
    this.pollWeather = this.pollWeather.bind(this);
    this.toQueryString = this.toQueryString.bind(this);
    this.convertTemp = this.convertTemp.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.pollWeather);
  }

  componentWillReceiveProps(props) {
    if(!this.state.weather || this.state.weather && props.weather.name !== this.state.weather.name) {
      this.setState({weather: props.weather})
    }
    if(!this.state.forecast && props.forecast.city || this.state.forecast && props.forecast.city.name !== this.state.forecast.city.name) {
      this.setState({forecast: props.forecast})
    }
  }


  pollWeather(location) {
    let url = 'http://api.openweathermap.org/data/2.5/weather?';
    let forcasturl = 'http://api.openweathermap.org/data/2.5/forecast?';
    const params = {
      lat: location.coords.latitude,
      lon: location.coords.longitude
    };
    url += this.toQueryString(params);
    forcasturl += this.toQueryString(params);
    const apiKey = '4499a256d68d5af745805dd42ac9ccf1';
    url += `&APPID=${apiKey}`;
    forcasturl += `&APPID=${apiKey}`;
    this.props.requestWeather(url)
    this.props.requestForecast(forcasturl)
  }

  toQueryString(obj) {
    const parts = [];
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            parts.push(`${encodeURIComponent(i)}=${encodeURIComponent(obj[i])}`);
        }
    }
    return parts.join('&');
  }

  convertTemp(degrees) {
    if(this.state.temp === "far") {
      return Math.round(degrees * 9/5 - 459.67)
    }
  }


  render() {

    let weatherInfo;
    let forecastInfo;

    if(this.state.forecast) {

    }

    if(this.state.weather) {
      weatherInfo = <div className="weather-container">
        <span>
          <h1>{this.state.weather.name}</h1>
          <p>{this.state.weather.weather[0].main}</p>

          <nav>{this.convertTemp(this.state.weather.main.temp)}°</nav>
        </span>

      </div>
    }
        return(
          <div>
            <div className="nav-bar">
              <h1>Rain or Shine</h1>
                <img className="logo" src="images/logo.png"></img>
            </div>

            {weatherInfo}


          </div>

      )
    }
}


  export default Home;
