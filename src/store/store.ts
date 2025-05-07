import { configureStore } from '@reduxjs/toolkit';
import citiesReducer from './citiesSlice';
import weatherReducer from './weatherSlice';

const store = configureStore({
  reducer: {
    cities: citiesReducer,
    weather: weatherReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export default store;
