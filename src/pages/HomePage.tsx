import React from 'react';
import { useSelector } from 'react-redux';
import CityCard from '../components/CityCard/CityCard';
import CityForm from '../components/CityForm/CityForm';
import type { RootState } from '../types';

const HomePage: React.FC = () => {
  const cities = useSelector((state: RootState) => state.cities.items);

  return (
    <div className="container">
      <h1 className="page-title">Weather Dashboard</h1>
      <p className="page-description">
        Track the weather in your favorite cities
      </p>

      <CityForm />

      {cities.length === 0 ? (
        <div className="empty-state">
          <p>No cities added yet. Add your first city above!</p>
        </div>
      ) : (
        <div className="cities-grid">
          {cities.map((city) => (
            <CityCard key={city.id} cityId={city.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
