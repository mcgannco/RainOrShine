import React from 'react';
import HourlyItem from './hourly_item';

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
    this.getMainBackground = this.getMainBackground.bind(this);
    this.getDayLight = this.getDayLight.bind(this);
    this.getDayOfWeek = this.getDayOfWeek.bind(this);
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

  getMainBackground() {
    let key = this.state.weather.weather[0].main
    let hash = {"Clouds": "clouds",
      "Snow": "snow",
      "Rain": "rain"
    }
    if(hash[key]) {
      return hash[key]
    } else {
      return "default"
    }
  }

  getDayLight() {
    return "daylight"
  }

  getDayOfWeek() {
    let days = {0: "Sunday", 1: "Monday",
    2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"}
    let d = new Date();
    let n = d.getDay();
    return days[n];
  }

  render() {
    let weatherInfo =
    <div className="loader-container">
      <div className="lds-ripple"><div></div><div></div></div>;
    </div>
    let mainBackground;
    let daylight;
    if(this.state.weather && this.state.forecast) {
      let hourlyArr = this.state.forecast.list.slice(0,10)
      mainBackground = this.getMainBackground()
      daylight = this.getDayLight()
      let imgURL = this.state.weather.weather[0].icon
      let imgSrc = `http://openweathermap.org/img/w/${imgURL}.png`
      weatherInfo = <div className="weather-container">
        <div className={daylight}>
          <span className={mainBackground}>
            <h1>{this.state.weather.name}</h1>
            <p>{this.state.weather.weather[0].main}</p>

            <nav>{this.convertTemp(this.state.weather.main.temp)}°</nav>

          <div className="date">
            <h2>{this.getDayOfWeek()}</h2>
            <span>Today</span>
          </div>

          <div className="hourly-forcast">
            <div>
              <ul className="hourly-list">
                <li>
                  <h3>Now</h3>
                  <img src={imgSrc}></img>
                  <span>{this.convertTemp(this.state.weather.main.temp)}°</span>
                </li>
                {hourlyArr.map((forecast,idx) => <HourlyItem idx={idx} key={idx} forecast={forecast}/>)}
              </ul>
            </div>
          </div>
          </span>
        </div>
        <h1>Details</h1>
      </div>
    }
        return(
          <div>
            <div className="nav-bar">
              <h1>RainOrShine</h1>
                <img className="logo" src="images/logo.png"></img>
            </div>
            {weatherInfo}
          </div>

      )
    }
}


  export default Home;
