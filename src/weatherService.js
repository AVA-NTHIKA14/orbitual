
import axios from 'axios';

const OPENWEATHER_API_KEY = "c3d22ba5366ec51a1b90cb4ebd7ea7d9";

export const getCoordinates = async (locationName) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationName)}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );
    if (response.data && response.data.length > 0) {
      return {
        lat: response.data[0].lat,
        lon: response.data[0].lon,
        name: response.data[0].name,
        country: response.data[0].country
      };
    }
    throw new Error('Location not found');
  } catch (error) {
    console.error('Error getting coordinates:', error);
    throw error;
  }
};

export const getOpenWeatherData = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getNASAPowerData = async (lat, lon) => {
  try {
    const today = new Date();
    const startDate = formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000));
    const endDate = formatDate(new Date());
    const response = await axios.get(
      `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR,WS2M,RH2M&community=RE&longitude=${lon}&latitude=${lat}&start=${startDate}&end=${endDate}&format=JSON`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching NASA data:', error);
    return null;
  }
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

export const getWeatherLikelihoodData = async (locationName) => {
  try {
    const coords = await getCoordinates(locationName);
    const weatherData = await getOpenWeatherData(coords.lat, coords.lon);
    const nasaData = await getNASAPowerData(coords.lat, coords.lon);
    const currentWeather = weatherData.list[0];
    const forecast = weatherData.list.slice(0, 24);
    const getAverage = (dayData, field) =>
      Math.round(dayData.reduce((acc, item) => acc + item.main[field], 0) / dayData.length);
    const getWindAverage = (dayData) =>
      Math.round((dayData.reduce((acc, item) => acc + item.wind.speed, 0) / dayData.length) * 3.6);
    const getRainProbability = (dayData) =>
      Math.round((dayData.filter(item => item.pop > 0.3).length / dayData.length) * 100);
    const day1 = forecast.slice(0, 8);
    const day2 = forecast.slice(8, 16);
    const day3 = forecast.slice(16, 24);
    let nasaContext = {
      modisTemp: currentWeather.main.temp,
      gpmRainfall: 0,
      ecostressHeat: 'Moderate',
      historicalContext: 'Real-time data from NASA POWER API'
    };
    if (nasaData && nasaData.properties && nasaData.properties.parameter) {
      const params = nasaData.properties.parameter;
      const dates = Object.keys(params.T2M || {});
      if (dates.length > 0) {
        const recentTemps = dates.slice(-7).map(d => params.T2M[d]);
        const avgTemp = recentTemps.reduce((a, b) => a + b, 0) / recentTemps.length;
        nasaContext.historicalContext = `7-day average temperature: ${avgTemp.toFixed(1)}°C`;
      }
    }
    return {
      location: `${coords.name}, ${coords.country}`,
      current: {
        temp: Math.round(currentWeather.main.temp),
        humidity: currentWeather.main.humidity,
        windSpeed: Math.round(currentWeather.wind.speed * 3.6),
        precipitation: Math.round((currentWeather.pop || 0) * 100),
        cloudCover: currentWeather.clouds.all
      },
      forecast: [
        {
          day: 'Today',
          temp: getAverage(day1, 'temp'),
          humidity: getAverage(day1, 'humidity'),
          wind: getWindAverage(day1),
          rain: getRainProbability(day1),
          condition: day1[0].weather[0].description
        },
        {
          day: 'Tomorrow',
          temp: getAverage(day2, 'temp'),
          humidity: getAverage(day2, 'humidity'),
          wind: getWindAverage(day2),
          rain: getRainProbability(day2),
          condition: day2[0].weather[0].description
        },
        {
          day: 'Day 3',
          temp: getAverage(day3, 'temp'),
          humidity: getAverage(day3, 'humidity'),
          wind: getWindAverage(day3),
          rain: getRainProbability(day3),
          condition: day3[0].weather[0].description
        }
      ],
      nasaData: nasaContext
    };
  } catch (error) {
    console.error('Error in getWeatherLikelihoodData:', error);
    throw error;
  }
};