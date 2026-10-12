import express from "express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler } from "@modelcontextprotocol/server";

import { PORT } from "./constants/app";
import { createServer } from "./mcp/server";

const app = express();
const mcpHandler = toNodeHandler(createMcpHandler(createServer));


app.all("/mcp", (req, res) => mcpHandler(req, res));

app.listen(Number(PORT));
