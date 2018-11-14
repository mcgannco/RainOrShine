export const fetchWeather = (url) => (
  $.ajax({
    method: 'GET',
    url: `${url}`,
  })
);

export const fetchForecast = (forecast) => (
  $.ajax({
    method: 'GET',
    url: `${forecast}`,
  })
);
