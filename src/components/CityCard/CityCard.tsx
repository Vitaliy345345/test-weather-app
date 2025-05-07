import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeCity } from '../../store/citiesSlice';
import { updateCityWeather } from '../../store/weatherSlice';
import type { AppDispatch } from '../../store/store';
import type { RootState } from '../../types';
import { formatTemperature, getRelativeTime } from '../../utils/formatters';
import './CityCard.scss';

interface CityCardProps {
  cityId: number;
}

const CityCard: React.FC<CityCardProps> = ({ cityId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const city = useSelector((state: RootState) =>
    state.cities.items.find((city) => city.id === cityId),
  );

  const weatherData = useSelector(
    (state: RootState) => state.weather.currentWeather[cityId],
  );

  const isLoading = useSelector(
    (state: RootState) => state.weather.loading.isLoading,
  );

  useEffect(() => {
    if (city && !weatherData) {
      dispatch(updateCityWeather(cityId));
    }
  }, [city, weatherData, cityId, dispatch]);

  if (!city) {
    return null;
  }

  const handleUpdateWeather = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(updateCityWeather(cityId));
  };

  const handleRemoveCity = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeCity(cityId));
  };

  const handleCardClick = () => {
    navigate(`/city/${cityId}`);
  };

  return (
    <div className="city-card" onClick={handleCardClick}>
      <div className="city-card__header">
        <h3 className="city-card__name">{city.name}</h3>
        <button
          className="city-card__remove"
          onClick={handleRemoveCity}
          aria-label="Remove city"
        >
          ×
        </button>
      </div>

      {isLoading && cityId === weatherData?.id ? (
        <div className="city-card__loading">Loading...</div>
      ) : weatherData ? (
        <div className="city-card__content">
          <div className="city-card__weather">
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
              alt={weatherData.description}
              className="city-card__icon"
            />
            <div className="city-card__temp">
              {formatTemperature(weatherData.temp)}
            </div>
          </div>

          <div className="city-card__details">
            <p className="city-card__description">{weatherData.description}</p>
            <p className="city-card__updated">
              Updated: {getRelativeTime(weatherData.timestamp)}
            </p>
          </div>

          <button
            className="city-card__update-btn"
            onClick={handleUpdateWeather}
            disabled={isLoading}
          >
            Update
          </button>
        </div>
      ) : (
        <div className="city-card__loading">Loading weather data...</div>
      )}
    </div>
  );
};

export default CityCard;
