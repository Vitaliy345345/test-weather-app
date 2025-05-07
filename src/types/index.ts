export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    '3h'?: number;
  };
  snow?: {
    '3h'?: number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
}

// Current weather data for a city
export interface WeatherData {
  id: number;
  name: string;
  country: string;
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  description: string;
  icon: string;
  timestamp: string;
}

// City with optional weather data
export interface City {
  id: number;
  name: string;
  weatherData?: WeatherData;
}

// Hourly data point
export interface HourlyDataPoint {
  time: Date;
  temp: number;
  icon: string;
  description: string;
}

// Hourly forecast for a city
export interface HourlyForecast {
  cityId: number;
  cityName: string;
  hourlyData: HourlyDataPoint[];
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Root state
export interface RootState {
  cities: {
    items: City[];
    loading: LoadingState;
  };
  weather: {
    currentWeather: Record<number, WeatherData>;
    hourlyForecasts: Record<number, HourlyForecast>;
    loading: LoadingState;
  };
}
