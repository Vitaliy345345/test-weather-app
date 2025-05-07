import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateCityWeather,
  fetchCityHourlyForecast,
} from '../../store/weatherSlice';
import { formatTemperature, formatDate } from '../../utils/formatters';
import './CityDetail.scss';
import type { AppDispatch } from '../../store/store';
import type { RootState } from '../../types';
import HourlyForecast from '../HourlyForecast/HourlyForecast';

interface CityDetailProps {
  cityId: number;
}

const CityDetail: React.FC<CityDetailProps> = ({ cityId }) => {
  const dispatch = useDispatch<AppDispatch>();

  const weatherData = useSelector(
    (state: RootState) => state.weather.currentWeather[cityId],
  );

  const hourlyForecast = useSelector(
    (state: RootState) => state.weather.hourlyForecasts[cityId],
  );

  const isLoading = useSelector(
    (state: RootState) => state.weather.loading.isLoading,
  );

  useEffect(() => {
    dispatch(updateCityWeather(cityId));

    if (!hourlyForecast) {
      dispatch(fetchCityHourlyForecast(cityId));
    }
  }, [cityId, hourlyForecast, dispatch]);

  if (isLoading && !weatherData) {
    return <div className="city-detail__loading">Loading weather data...</div>;
  }

  if (!weatherData) {
    return <div className="city-detail__error">Weather data not available</div>;
  }

  return (
    <div className="city-detail">
      <div className="city-detail__header">
        <h1 className="city-detail__title">
          {weatherData.name}, {weatherData.country}
        </h1>
        <p className="city-detail__timestamp">
          Updated: {formatDate(weatherData.timestamp)}
        </p>
      </div>

      <div className="city-detail__current-weather">
        <div className="city-detail__temperature-container">
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.icon}@4x.png`}
            alt={weatherData.description}
            className="city-detail__icon"
          />
          <div className="city-detail__temperature">
            {formatTemperature(weatherData.temp)}
          </div>
        </div>

        <div className="city-detail__info">
          <div className="city-detail__description">
            {weatherData.description}
          </div>
          <div className="city-detail__feels-like">
            Feels like: {formatTemperature(weatherData.feels_like)}
          </div>

          <div className="city-detail__stats">
            <div className="city-detail__stat">
              <span className="city-detail__stat-label">Humidity:</span>
              <span className="city-detail__stat-value">
                {weatherData.humidity}%
              </span>
            </div>
            <div className="city-detail__stat">
              <span className="city-detail__stat-label">Pressure:</span>
              <span className="city-detail__stat-value">
                {weatherData.pressure} hPa
              </span>
            </div>
            <div className="city-detail__stat">
              <span className="city-detail__stat-label">Wind:</span>
              <span className="city-detail__stat-value">
                {weatherData.wind_speed} m/s
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="city-detail__forecast">
        <h2 className="city-detail__subtitle">Today's Forecast</h2>
        {hourlyForecast ? (
          <HourlyForecast forecast={hourlyForecast} />
        ) : (
          <div className="city-detail__loading">Loading forecast...</div>
        )}
      </div>

      <button
        className="city-detail__update-btn"
        onClick={() => dispatch(updateCityWeather(cityId))}
        disabled={isLoading}
      >
        {isLoading ? 'Updating...' : 'Update Weather'}
      </button>
    </div>
  );
};

export default CityDetail;
