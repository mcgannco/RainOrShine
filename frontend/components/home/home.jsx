import React from 'react';
import HourlyItem from './hourly_item';

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      weather: null,
      forecast: null,
      temp: "far",
      expand: false,
      types : {"Clouds": "clouds",
        "Snow": "snow",
        "Rain": "rain",
        "Haze": "haze",
        "Clear" : "clear"
      }
    }
    this.pollWeather = this.pollWeather.bind(this);
    this.toQueryString = this.toQueryString.bind(this);
    this.convertTemp = this.convertTemp.bind(this);
    this.getMainBackground = this.getMainBackground.bind(this);
    this.getDayLight = this.getDayLight.bind(this);
    this.getDayOfWeek = this.getDayOfWeek.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
    this.getForecastDay = this.getForecastDay.bind(this);
    this.getForecastHighLow = this.getForecastHighLow.bind(this);
    this.getForecastWeather = this.getForecastWeather.bind(this);
    this.getForecastDescription = this.getForecastDescription.bind(this);
    this.getForecastDayBackground = this.getForecastDayBackground.bind(this);
    this.getDuskTime = this.getDuskTime.bind(this);
    this.getVisibility = this.getVisibility.bind(this);
    this.getWind = this.getWind.bind(this);
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
    if(!this.state.weather || !this.state.weather.weather) return null
    let key = this.state.weather.weather[0].main
    let today = new Date(this.state.weather.dt * 1000);
    let sunrise = new Date(this.state.weather.sys.sunrise * 1000);
    let sunset = new Date(this.state.weather.sys.sunrise * 1000);
    if(today < sunrise) {
      return "default"
    }

    if(this.state.types[key]) {
      return this.state.types[key]
    } else {
      return "default"
    }
  }

  getDayLight() {
    if(!this.state.weather || !this.state.weather.sys) return null
    let today = new Date(this.state.weather.dt * 1000);
    let sunrise = new Date(this.state.weather.sys.sunrise * 1000);
    let sunset = new Date(this.state.weather.sys.sunrise * 1000);
    if(today < sunrise) {
      return "night"
      //night time
    } else if(today < sunset) {
      return "daylight"
      //day time
    } else if(today > sunrise) {
      return "daylight"
    } else {
      return "daylight"
    }


  }

  getDayOfWeek() {
    let days = {0: "Sunday", 1: "Monday",
    2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"}
    let d = new Date();
    let n = d.getDay();
    return days[n];
  }

  getForecastDay(idx) {
    let days = {0: "Sunday", 1: "Monday",
    2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"}
    let d = new Date();
    let n = d.getDay();
    return days[(n + idx) % 7];
  }

  toggleExpand() {
    this.setState({expand: !this.state.expand})
  }

  getForecastHighLow(day) {
    let today = new Date(this.state.weather.dt * 1000);
    var nextDay = new Date();
    nextDay.setDate(today.getDate() + day);
    let daysArr =[];
    this.state.forecast.list.forEach(function(element) {
      let dayDate = new Date(element.dt * 1000);
      if(dayDate.getMonth() === nextDay.getMonth() && dayDate.getDate() === nextDay.getDate() && dayDate.getFullYear() === nextDay.getFullYear()) {
        daysArr.push(element)
      }
    });;
    let high = -Infinity;
    let low = Infinity;
    daysArr.forEach(function(el) {
      if(el.main.temp_min < low) {
        low = el.main.temp_min
      }

      if(el.main.temp_max > high) {
        high = el.main.temp_max
      }
    })
    if(high === -Infinity || low === Infinity) return "Forecast TBD"
    return `${this.convertTemp(high)}° / ${this.convertTemp(low)}°`
  }

  getForecastWeather(day) {
    let today = new Date(this.state.weather.dt * 1000);
    var nextDay = new Date();
    nextDay.setDate(today.getDate() + day);
    let daysArr =[];
    this.state.forecast.list.forEach(function(element) {
      let dayDate = new Date(element.dt * 1000);
      if(dayDate.getMonth() === nextDay.getMonth() && dayDate.getDate() === nextDay.getDate() && dayDate.getFullYear() === nextDay.getFullYear()) {
        daysArr.push(element)
      }
    });;
    let weatherTypes = [];
    daysArr.forEach(function(el) {
      let weatherObj = el.weather;
      weatherObj.forEach(function(obj) {
        if(weatherTypes.indexOf(obj.main) < 0) {
          weatherTypes.push(obj.main)
        }
      })
    })
    if(weatherTypes.includes("Snow")) {
      return this.state.types["Snow"]
    } else if(weatherTypes.includes("Rain")) {
      return this.state.types["Rain"]
    } else if(weatherTypes.includes("Clouds")) {
      return this.state.types["Clouds"]
    } else if(weatherTypes.includes("Haze")) {
      return this.state.types["Haze"]
    } else if(weatherTypes.includes("Clear")) {
      return this.state.types["Clear"]
    } else {
      return "default"
    }
  }

  getForecastDescription(day) {
    let today = new Date(this.state.weather.dt * 1000);
    var nextDay = new Date();
    nextDay.setDate(today.getDate() + day);
    let daysArr =[];
    this.state.forecast.list.forEach(function(element) {
      let dayDate = new Date(element.dt * 1000);
      if(dayDate.getMonth() === nextDay.getMonth() && dayDate.getDate() === nextDay.getDate() && dayDate.getFullYear() === nextDay.getFullYear()) {
        daysArr.push(element)
      }
    });;
    let weatherTypes = [];
    daysArr.forEach(function(el) {
      let weatherObj = el.weather;
      weatherObj.forEach(function(obj) {
        if(weatherTypes.indexOf(obj.main) < 0) {
          weatherTypes.push(obj.main)
        }
      })
    })

    if(weatherTypes.length === 1) {
      return weatherTypes[0]
    } else if (!weatherTypes.length) {
      return ""
    } else {
      if(weatherTypes.indexOf("Snow") >= 0) {
        return "Snow"
      } else if(weatherTypes.indexOf("Rain") >= 0) {
        return "Rain"
      } else if(weatherTypes.indexOf("Haze") >= 0) {
        return "Haze"
      } else if(weatherTypes.indexOf("Clouds") >= 0 && weatherTypes.indexOf("Clear") >= 0) {
        return "Partly Cloudy"
      } else {
        return daysArr[0].weather[0].main
      }
    }
  }

  getForecastDayBackground(day) {
    let today = new Date(this.state.weather.dt * 1000);
    var nextDay = new Date();
    nextDay.setDate(today.getDate() + day);
    let daysArr =[];
    this.state.forecast.list.forEach(function(element) {
      let dayDate = new Date(element.dt * 1000);
      if(dayDate.getMonth() === nextDay.getMonth() && dayDate.getDate() === nextDay.getDate() && dayDate.getFullYear() === nextDay.getFullYear()) {
        daysArr.push(element)
      }
    });;
    let weatherTypes = [];
    daysArr.forEach(function(el) {
      let weatherObj = el.weather;
      weatherObj.forEach(function(obj) {
        if(weatherTypes.indexOf(obj.main) < 0) {
          weatherTypes.push(obj.main)
        }
      })
    })

    if (!weatherTypes.length) {
      return "weekly-forecast-default"
    } else {
      if(weatherTypes.indexOf("Snow") >= 0) {
        return "weekly-forecast-snow"
      } else if(weatherTypes.indexOf("Rain") >= 0) {
        return "weekly-forecast-rain"
      } else if(weatherTypes.indexOf("Haze") >= 0) {
        return "weekly-forecast-haze"
      } else if(weatherTypes.indexOf("Clouds") >= 0 && weatherTypes.indexOf("Clear") >= 0) {
        return "weekly-forecast-clouds"
      } else {
        return "weekly-forecast-default"
      }
    }
  }

  getDuskTime(id) {
    let sunrise = new Date(this.state.weather.sys.sunrise * 1000)
    let sunset = new Date(this.state.weather.sys.sunset * 1000)
    let d;
    if(id === "sunset") {
      d = sunset
    } else {
      d = sunrise
    }
    let yyyy = d.getFullYear()
		let mm = ('0' + (d.getMonth() + 1)).slice(-2)	// Months are zero based. Add leading 0.
		let dd = ('0' + d.getDate()).slice(-2)		// Add leading 0.
		let hh = d.getHours()
		let h = hh
		let min = ('0' + d.getMinutes()).slice(-2)	// Add leading 0.
		let ampm = 'AM'
		let time;

	if (hh > 12) {
		h = hh - 12;
		ampm = 'PM';
	} else if (hh === 12) {
		h = 12;
		ampm = 'PM';
	} else if (hh == 0) {
		h = 12;
	}

	// ie: 2013-02-18, 8:35 AM
	time = h  + `:` + min + ' ' +  ampm;

  	return time;
  }

  getVisibility() {
    let visibility = this.state.weather.visibility * 0.000621371;
    let rounded = (Math.round( visibility * 10 ) / 10).toFixed(1);
    return `${rounded} miles`
  }

  getWind() {
    let speed = Math.floor(this.state.weather.wind.speed * 2.23694);
    let dir = this.state.weather.wind.deg;
    let dirName;
    if(dir >=0 && dir<= 90) {
      dirName = "NE"
    } else if(dir > 90 && dir <= 180) {
      dirName = "SE"
    } else if (dir > 180 && dir <= 270) {
      dirName = "SW"
    } else {
      dirName = "NW"
    }

    return `${dirName} ${speed} mph`
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
        <div className="today-container">
        <div className={daylight}>
          <span className={mainBackground}>
            <div className="expand">
              <section>
                <span onClick={this.toggleExpand} className={this.state.expand ? "hidden" : "plus"}><i className="fas fa-plus"></i></span>
                <span onClick={this.toggleExpand} className={this.state.expand ? "minus" : "hidden"}><i className="fas fa-minus"></i></span>
              </section>

            </div>
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
        <div className={this.state.expand ? "details-container" : "hidden"}>
          <div className="forecast-details">
            <h3>Details</h3>
            <span>
              <ul>
                <li><section>High:</section> <section>{this.convertTemp(this.state.weather.main.temp_max)}°</section></li>
                <li><section>Low:</section> <section>{this.convertTemp(this.state.weather.main.temp_min)}°</section></li>
                <li><section>Sunrise:</section> <section>{this.getDuskTime("sunrise")}</section></li>
                <li><section>Sunset:</section> <section>{this.getDuskTime("sunset")}</section></li>
                <li><section>Humidity:</section> <section>{this.state.weather.main.humidity}%</section></li>
                <li><section>Pressure:</section> <section>{this.state.weather.main.pressure} hPa</section></li>
                <li><section>Visibility:</section> <section>{this.getVisibility()}</section></li>
                <li><section>Wind:</section> <section>{this.getWind()}</section></li>
              </ul>
            </span>
          </div>
          </div>
          </div>

          <div className="weekly-forecast">
            <h3>5 Day Forecast</h3>
            <ul>
              <li className={this.getForecastDayBackground(1)}>
                <span className={this.getForecastWeather(1)}>
                  <h4>{this.getForecastDay(1)}</h4>
                  <div>{this.getForecastDescription(1)}</div>
                  <div>{this.getForecastHighLow(1)}</div>
                </span>
              </li>

              <li className={this.getForecastDayBackground(2)}>
                <span className={this.getForecastWeather(2)}>
                  <h4>{this.getForecastDay(2)}</h4>
                  <div>{this.getForecastDescription(2)}</div>
                  <div>{this.getForecastHighLow(2)}</div>
                </span>
              </li>

              <li className={this.getForecastDayBackground(3)}>
                <span className={this.getForecastWeather(3)}>
                  <h4>{this.getForecastDay(3)}</h4>
                  <div>{this.getForecastDescription(3)}</div>
                  <div>{this.getForecastHighLow(3)}</div>
                </span>
              </li>

              <li className={this.getForecastDayBackground(4)}>
                <span className={this.getForecastWeather(4)}>
                  <h4>{this.getForecastDay(4)}</h4>
                  <div>{this.getForecastDescription(4)}</div>
                  <div>{this.getForecastHighLow(4)}</div>
                </span>
              </li>

              <li className={this.getForecastDayBackground(5)}>
                <span className={this.getForecastWeather(5)}>
                  <h4>{this.getForecastDay(5)}</h4>
                  <div>{this.getForecastDescription(5)}</div>
                  <div>{this.getForecastHighLow(5)}</div>
                </span>
              </li>
            </ul>
          </div>
      </div>
    }
        return(
          <div className="main-container">
            <div className="nav-bar">
              <div className="left-nav">
                <nav>
                  <section><i className="fas fa-search"></i></section>
                  <input placeholder="Search for weather..."></input>
                </nav>

                <span>
                  <h1>RainOrShine</h1>
                  <img className="logo" src="images/logo.png"></img>
                </span>

              </div>


            </div>
            {weatherInfo}
          </div>

      )
    }
}


  export default Home;
