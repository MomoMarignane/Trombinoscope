import axios from 'axios';

const fetchWeatherData = async (city) => {
  try {
    const apiKey = '63c4642be61c6323a9e5224a8fa84d5f';
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data', error);
    throw error;
  }
};

export default fetchWeatherData;
