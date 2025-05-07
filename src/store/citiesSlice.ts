import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from '../utils/LocalStorage';
import type { City, LoadingState } from '../types';
import { fetchWeatherByCity } from '../api/weatherAPI';

// Initial state
interface CitiesState {
  items: City[];
  loading: LoadingState;
}

const initialState: CitiesState = {
  items: loadFromLocalStorage('cities') || [],
  loading: {
    isLoading: false,
    error: null,
  },
};

export const addCity = createAsyncThunk(
  'cities/addCity',
  async (cityName: string, { getState }) => {
    const weatherData = await fetchWeatherByCity(cityName);

    const state = getState() as { cities: CitiesState };
    const newCity = { id: weatherData.id, name: weatherData.name };

    const cityExists = state.cities.items.some(
      (city) => city.id === newCity.id,
    );
    if (cityExists) {
      throw new Error('City already added to your list.');
    }

    const updatedCities = [...state.cities.items, newCity];
    saveToLocalStorage('cities', updatedCities);

    return newCity;
  },
);

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    removeCity: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((city) => city.id !== action.payload);
      saveToLocalStorage('cities', state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCity.pending, (state) => {
        state.loading.isLoading = true;
        state.loading.error = null;
      })
      .addCase(addCity.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading.isLoading = false;
      })
      .addCase(addCity.rejected, (state, action) => {
        state.loading.isLoading = false;
        state.loading.error = action.error.message || 'Failed to add city';
      });
  },
});

export const { removeCity } = citiesSlice.actions;
export default citiesSlice.reducer;
