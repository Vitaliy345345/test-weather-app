import axios from 'axios';
import type { WeatherData, HourlyForecast, ForecastItem } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * @param city - City name
 */
export const fetchWeatherByCity = async (
  city: string,
): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });

    return {
      id: response.data.id,
      name: response.data.name,
      country: response.data.sys.country,
      temp: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      wind_speed: response.data.wind.speed,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('City not found. Please check the name and try again.');
    }
    throw new Error('Failed to fetch weather data. Please try again later.');
  }
};

/**
 * Fetch hourly forecast for a city
 * @param lat - Latitude
 * @param lon - Longitude
 */
export const fetchHourlyForecast = async (
  lat: number,
  lon: number,
): Promise<HourlyForecast> => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        cnt: 8,
      },
    });

    const hourlyData = response.data.list.map((item: ForecastItem) => ({
      time: new Date(item.dt * 1000),
      temp: item.main.temp,
      icon: item.weather[0].icon,
      description: item.weather[0].description,
    }));

    return {
      cityId: response.data.city.id,
      cityName: response.data.city.name,
      hourlyData,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch hourly forecast. Please try again later. ${error}`,
    );
  }
};

/**
 * Get coordinates for a city by name
 * @param cityId - City ID
 */
export const fetchCityCoordinates = async (
  cityId: number,
): Promise<{ lat: number; lon: number }> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        id: cityId,
        appid: API_KEY,
      },
    });

    return {
      lat: response.data.coord.lat,
      lon: response.data.coord.lon,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch city coordinates. Please try again later. ${error}`,
    );
  }
};
