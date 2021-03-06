import React from 'react';

class HourlyItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.convertTimestamp = this.convertTimestamp.bind(this);
    this.convertTemp = this.convertTemp.bind(this);
    this.getDayOfWeek = this.getDayOfWeek.bind(this);
  }

  convertTimestamp(timestamp) {

    let gmt = timestamp + this.props.offset
    let localTime = new Date(gmt*1000)

		let yyyy = localTime.getUTCFullYear(),
		mm = ('0' + (localTime.getUTCMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
		dd = ('0' + localTime.getUTCDate()).slice(-2),			// Add leading 0.
		hh = localTime.getUTCHours(),
		h = hh,
		min = ('0' + localTime.getUTCMinutes()).slice(-2),		// Add leading 0.
		ampm = 'AM',
		time;

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
	time = h  + ampm;

	return time;
}

convertTemp(degrees) {
  if(this.props.temp === true) {
    return Math.round(degrees * 9/5 - 459.67)
  } else {
    return Math.round(degrees - 273.15)
  }

}

getDayOfWeek(forecast) {
  let days = {0: "Sunday", 1: "Monday",
  2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"}
  let timestamp = forecast.dt; // UNIX timestamp in seconds
  let xx = new Date();
  xx.setTime(timestamp*1000); // javascript timestamps are in milliseconds
  let key = xx.getDay()
  return days[key]
}

  render() {
    let {forecast} = this.props;
    let weekDay = this.getDayOfWeek(forecast)
    let imgURL = forecast.weather[0].icon;
    let imgSrc = `https://openweathermap.org/img/w/${imgURL}.png`
    return(
      <li>
        <h3>{this.convertTimestamp(forecast.dt)}</h3>
        <img src={imgSrc}></img>
        <span>{this.convertTemp(forecast.main.temp)}°</span>
      </li>
    )

  }

};

export default HourlyItem;
