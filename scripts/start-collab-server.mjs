// scripts/start-collab-server.mjs
import pkg from "y-websocket-server/bin.js";
import { WebSocketServer } from "ws";
import * as http from "http";

const { setupWSConnection } = pkg; // ✅ destructure from default export

const port = 1234;
const host = "localhost";

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("✅ Y-WebSocket Server Running");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  const room = req.url?.slice(1) || "default";
  setupWSConnection(ws, req, { docName: room });
  console.log(`🟢 Client connected to room: ${room}`);
});

server.listen(port, host, () => {
  console.log(`🚀 Y-WebSocket server running at ws://${host}:${port}`);
});
