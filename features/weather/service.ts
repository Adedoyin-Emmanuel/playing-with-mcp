import axios from "axios";
import {
  OPEN_WEATHER_API_KEY,
  OPEN_WEATHER_API_BASE,
} from "./../../constants/app";
import { IForecastResponse, IWeatherResponse } from "./types";

type Units = "standard" | "metric" | "imperial";

const openWeather = axios.create({
  baseURL: `${OPEN_WEATHER_API_BASE}/data/2.5`,
});

class WeatherService {
  private static async request<T>(
    path: string,
    params: Record<string, string | number>
  ) {
    if (!OPEN_WEATHER_API_KEY) {
      throw new Error("OPEN_WEATHER_API_KEY is not set");
    }

    const { data } = await openWeather.get<T>(path, {
      params: { ...params, appid: OPEN_WEATHER_API_KEY },
    });

    return data;
  }

  static async getWeatherByQuery(query: string, units: Units = "metric") {
    return this.request<IWeatherResponse>("/weather", { q: query, units });
  }

  static async getWeatherByLongitudeAndLatitude(
    lon: number,
    lat: number,
    units: Units = "metric"
  ) {
    return this.request<IWeatherResponse>("/weather", { lon, lat, units });
  }

  static async getForecastByQuery(
    query: string,
    units: Units = "metric",
    count?: number
  ) {
    return this.request<IForecastResponse>("/forecast", {
      q: query,
      units,
      ...(count && { cnt: count }),
    });
  }

  static async getForecastByLongitudeAndLatitude(
    lon: number,
    lat: number,
    units: Units = "metric",
    count?: number
  ) {
    return this.request<IForecastResponse>("/forecast", {
      lon,
      lat,
      units,
      ...(count && { cnt: count }),
    });
  }
}

export default WeatherService;
