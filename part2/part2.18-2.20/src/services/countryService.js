import axios from 'axios'

const countriesUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getAll = () => axios.get(countriesUrl).then((response) => response.data)

const getWeather = (latitude, longitude, apiKey) =>
  axios
    .get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: latitude,
        lon: longitude,
        units: 'metric',
        appid: apiKey,
      },
    })
    .then((response) => response.data)

export default { getAll, getWeather }
