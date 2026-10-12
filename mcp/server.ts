import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { registerWeatherTools } from "./../features/weather/tools";

const createServer = () => {
  const server = new McpServer({
    name: "weather",
    version: "1.0.0",
  });

  registerWeatherTools(server);

  return server;
};

serveStdio(createServer, {
  onerror: (error) => {
    console.error("Weather MCP Server error:", error);
  },
});

console.error("Weather MCP Server running");
