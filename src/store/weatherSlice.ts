import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { WeatherData, HourlyForecast, LoadingState } from '../types';
import {
  fetchCityCoordinates,
  fetchHourlyForecast,
  fetchWeatherByCity,
} from '../api/weatherAPI';

interface WeatherState {
  currentWeather: Record<number, WeatherData>;
  hourlyForecasts: Record<number, HourlyForecast>;
  loading: LoadingState;
}

const initialState: WeatherState = {
  currentWeather: {},
  hourlyForecasts: {},
  loading: {
    isLoading: false,
    error: null,
  },
};

export const fetchWeatherForCity = createAsyncThunk(
  'weather/fetchWeatherForCity',
  async (cityName: string) => {
    return await fetchWeatherByCity(cityName);
  },
);

export const updateCityWeather = createAsyncThunk(
  'weather/updateCityWeather',
  async (cityId: number, { getState }) => {
    const state = getState() as {
      cities: { items: { id: number; name: string }[] };
    };
    const city = state.cities.items.find((city) => city.id === cityId);

    if (!city) {
      throw new Error('City not found');
    }

    return await fetchWeatherByCity(city.name);
  },
);

export const fetchCityHourlyForecast = createAsyncThunk(
  'weather/fetchCityHourlyForecast',
  async (cityId: number) => {
    const { lat, lon } = await fetchCityCoordinates(cityId);
    return await fetchHourlyForecast(lat, lon);
  },
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherForCity.pending, (state) => {
        state.loading.isLoading = true;
        state.loading.error = null;
      })
      .addCase(fetchWeatherForCity.fulfilled, (state, action) => {
        const weatherData = action.payload;
        state.currentWeather[weatherData.id] = weatherData;
        state.loading.isLoading = false;
      })
      .addCase(fetchWeatherForCity.rejected, (state, action) => {
        state.loading.isLoading = false;
        state.loading.error = action.error.message || 'Failed to fetch weather';
      })

      .addCase(updateCityWeather.pending, (state) => {
        state.loading.isLoading = true;
        state.loading.error = null;
      })
      .addCase(updateCityWeather.fulfilled, (state, action) => {
        const weatherData = action.payload;
        state.currentWeather[weatherData.id] = weatherData;
        state.loading.isLoading = false;
      })
      .addCase(updateCityWeather.rejected, (state, action) => {
        state.loading.isLoading = false;
        state.loading.error =
          action.error.message || 'Failed to update weather';
      })

      .addCase(fetchCityHourlyForecast.pending, (state) => {
        state.loading.isLoading = true;
        state.loading.error = null;
      })
      .addCase(fetchCityHourlyForecast.fulfilled, (state, action) => {
        const forecast = action.payload;
        state.hourlyForecasts[forecast.cityId] = forecast;
        state.loading.isLoading = false;
      })
      .addCase(fetchCityHourlyForecast.rejected, (state, action) => {
        state.loading.isLoading = false;
        state.loading.error =
          action.error.message || 'Failed to fetch hourly forecast';
      });
  },
});

export default weatherSlice.reducer;
