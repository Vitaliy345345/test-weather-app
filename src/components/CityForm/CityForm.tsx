import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCity } from '../../store/citiesSlice';
import type { AppDispatch } from '../../store/store';
import type { RootState } from '../../types';
import './CityForm.scss';

const CityForm: React.FC = () => {
  const [cityName, setCityName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector(
    (state: RootState) => state.cities.loading.isLoading,
  );
  const loadingError = useSelector(
    (state: RootState) => state.cities.loading.error,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cityName.trim()) {
      setError('Please enter a city name');
      return;
    }

    try {
      await dispatch(addCity(cityName)).unwrap();
      setCityName('');
    } catch (err) {
      throw new Error(`${err}`);
    }
  };

  return (
    <form className="city-form" onSubmit={handleSubmit}>
      <div className="city-form__input-group">
        <input
          type="text"
          className={`city-form__input ${error || loadingError ? 'city-form__input--error' : ''}`}
          placeholder="Enter city name"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="city-form__button"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add City'}
        </button>
      </div>

      {(error || loadingError) && (
        <div className="city-form__error">{error || loadingError}</div>
      )}
    </form>
  );
};

export default CityForm;
