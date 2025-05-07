import React, { useMemo } from 'react';
import type { HourlyForecast as HourlyForecastType } from '../../types';
import { formatTime, formatTemperature } from '../../utils/formatters';
import './HourlyForecast.scss';

interface HourlyForecastProps {
  forecast: HourlyForecastType;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecast }) => {
  const { minTemp, maxTemp } = useMemo(() => {
    const temps = forecast.hourlyData.map((item) => item.temp);
    return {
      minTemp: Math.floor(Math.min(...temps)),
      maxTemp: Math.ceil(Math.max(...temps)),
    };
  }, [forecast]);

  const tempRange = maxTemp - minTemp;

  const calculatePosition = (temp: number): number => {
    if (tempRange === 0) return 50;
    return 100 - ((temp - minTemp) / tempRange) * 100;
  };

  return (
    <div className="hourly-forecast">
      <div className="hourly-forecast__temp-scale">
        <div className="hourly-forecast__temp-label">
          {formatTemperature(maxTemp)}
        </div>
        <div className="hourly-forecast__temp-label">
          {formatTemperature(minTemp)}
        </div>
      </div>

      <div className="hourly-forecast__graph">
        {forecast.hourlyData.map((hour, index) => (
          <div key={index} className="hourly-forecast__hour">
            <div
              className="hourly-forecast__point"
              style={{ top: `${calculatePosition(hour.temp)}%` }}
            >
              <div className="hourly-forecast__tooltip">
                {formatTemperature(hour.temp)}
              </div>
            </div>

            <div className="hourly-forecast__hour-info">
              <img
                src={`http://openweathermap.org/img/wn/${hour.icon}.png`}
                alt={hour.description}
                className="hourly-forecast__icon"
              />
              <div className="hourly-forecast__time">
                {formatTime(hour.time)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
