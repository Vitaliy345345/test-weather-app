import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CityDetail from '../components/CityDetail/CityDetail';
import type { RootState } from '../types';

const CityDetailPage: React.FC = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const cityIdNumber = parseInt(cityId || '0', 10);

  const city = useSelector((state: RootState) =>
    state.cities.items.find((c) => c.id === cityIdNumber),
  );

  if (!city) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <CityDetail cityId={cityIdNumber} />
    </div>
  );
};

export default CityDetailPage;
