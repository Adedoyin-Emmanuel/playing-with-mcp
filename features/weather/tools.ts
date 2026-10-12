import { z } from "zod";
import type { CallToolResult, McpServer } from "@modelcontextprotocol/server";

import WeatherService from "./service";

const coordinatesSchema = {
  lat: z.number().min(-90).max(90).describe("Latitude of the location"),
  lon: z.number().min(-180).max(180).describe("Longitude of the location"),
};

const textResult = (text: string, isError = false): CallToolResult => ({
  content: [{ type: "text", text }],
  ...(isError && { isError }),
});

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

export const getWeatherTool = async (
  lon: number,
  lat: number
): Promise<CallToolResult> => {
  try {
    const data = await WeatherService.getWeatherByLongitudeAndLatitude(
      lon,
      lat
    );

    const conditions = data.weather.map((w) => w.description).join(", ");

    const weatherText = [
      `Weather details for ${data.name}, ${data.sys.country}:`,
      `Conditions: ${conditions}`,
      `Temperature: ${data.main.temp}°C (min ${data.main.temp_min}°C, max ${data.main.temp_max}°C)`,
      `Humidity: ${data.main.humidity}%`,
      `Pressure: ${data.main.pressure} hPa`,
      `Wind: ${data.wind.speed} m/s at ${data.wind.deg}°`,
      `Cloud cover: ${data.clouds.all}%`,
      `Visibility: ${data.visibility} m`,
    ].join("\n");

    return textResult(weatherText);
  } catch (error) {
    return textResult(
      `Failed to get weather data: ${errorMessage(error)}`,
      true
    );
  }
};

export const getForecastTool = async (
  lon: number,
  lat: number,
  count?: number
): Promise<CallToolResult> => {
  try {
    const data = await WeatherService.getForecastByLongitudeAndLatitude(
      lon,
      lat,
      "metric",
      count
    );

    const periods = data.list.map((period) => {
      const conditions = period.weather.map((w) => w.description).join(", ");
      const chanceOfRain = Math.round(period.pop * 100);

      return `${period.dt_txt} UTC: ${period.main.temp}°C, ${conditions}, ${chanceOfRain}% chance of precipitation, wind ${period.wind.speed} m/s`;
    });

    const forecastText = [
      `Forecast for ${data.city.name}, ${data.city.country}:`,
      ...periods,
    ].join("\n");

    return textResult(forecastText);
  } catch (error) {
    return textResult(
      `Failed to get forecast data: ${errorMessage(error)}`,
      true
    );
  }
};

export const registerWeatherTools = (server: McpServer) => {
  server.registerTool(
    "get_weather",
    {
      title: "Get current weather",
      description: "Get the current weather for a location by coordinates",
      inputSchema: z.object(coordinatesSchema),
    },
    async ({ lon, lat }) => getWeatherTool(lon, lat)
  );

  server.registerTool(
    "get_forecast",
    {
      title: "Get weather forecast",
      description:
        "Get the 5 day weather forecast in 3 hour steps for a location by coordinates",
      inputSchema: z.object({
        ...coordinatesSchema,
        count: z
          .number()
          .int()
          .min(1)
          .max(40)
          .optional()
          .describe("Number of 3 hour periods to return (8 is about 24 hours)"),
      }),
    },
    async ({ lon, lat, count }) => getForecastTool(lon, lat, count)
  );
};
