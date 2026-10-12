import axios from "axios";
import {
  OPEN_WEATHER_API_KEY,
  OPEN_WEATHER_API_BASE,
} from "./../../constants/app";
import { IWeatherResponse } from "./types";

type Units = "standard" | "metric" | "imperial";

const openWeather = axios.create({
  baseURL: `${OPEN_WEATHER_API_BASE}/data/2.5`,
});

class WeatherService {
  private static async fetchWeather(params: Record<string, string | number>) {
    if (!OPEN_WEATHER_API_KEY) {
      throw new Error("OPEN_WEATHER_API_KEY is not set");
    }

    const { data } = await openWeather.get<IWeatherResponse>("/weather", {
      params: { ...params, appid: OPEN_WEATHER_API_KEY },
    });

    return data;
  }

  static async getWeatherByQuery(query: string, units: Units = "metric") {
    return this.fetchWeather({ q: query, units });
  }

  static async getWeatherByLongitudeAndLatitude(
    lon: number,
    lat: number,
    units: Units = "metric"
  ) {
    return this.fetchWeather({ lon, lat, units });
  }
}

export default WeatherService;
