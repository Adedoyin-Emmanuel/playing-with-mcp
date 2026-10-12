import { McpServer } from "@modelcontextprotocol/server";
import { registerWeatherTools } from "./../features/weather/tools";

export const createServer = () => {
  const server = new McpServer({
    name: "weather",
    version: "1.0.0",
  });

  registerWeatherTools(server);

  return server;
};
