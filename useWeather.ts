
import { useState, useEffect } from 'react';
import { fetchWeather } from '../services/geminiService';
import { loadWeatherCache, saveWeatherCache } from '../services/dataService';
import type { WeatherData } from '../types';

export const useWeather = (city: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getWeather = async () => {
    // Check for cached data first.
    const cachedData = loadWeatherCache();
    if (cachedData) {
      setWeather(cachedData.data);
      setIsLoading(false);
      return; // Stop here if we have valid cached data.
    }

    // If no valid cache, fetch from API.
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchWeather(city);
      setWeather(data);
      
      // Save the newly fetched data to the cache, unless it's an error state
      if (data.condition !== 'Serviço indisponível') {
          saveWeatherCache(data);
      }
    } catch (err) {
      setError('Failed to fetch weather data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getWeather();
    // This interval will now trigger a cache check every 15 minutes.
    // An API call will only be made if the cache has expired.
    const intervalId = setInterval(getWeather, 900000); 

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  return { weather, isLoading, error };
};