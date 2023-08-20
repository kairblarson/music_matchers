const express = require("express");
const WebSocket = require("ws");
require("dotenv").config();

const app = express();
const server = require("http").createServer(app);
const PORT = 8081;
const wss = new WebSocket.Server({ server: server });
//rename this to config because its not really a service or just leave in index.js