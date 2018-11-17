import React from 'react';

class HourlyItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.convertTimestamp = this.convertTimestamp.bind(this);
  }

  convertTimestamp(timestamp) {
  var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
		yyyy = d.getFullYear(),
		mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
		dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
		hh = d.getHours(),
		h = hh,
		min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
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

  render() {
    let {forecast} = this.props;
    let imgURL = forecast.weather[0].icon;
    let imgSrc = `http://openweathermap.org/img/w/${imgURL}.png`
    return(
      <li>
        <h3>{this.convertTimestamp(forecast.dt)}</h3>
        <img src={imgSrc}></img>
      </li>
    )

  }

};

export default HourlyItem;
