#!/usr/bin/env node

/**
 * Module dependencies.
 */
import app from "../app";
import Debug from "debug";
import { createServer, Server } from "http";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { alchemyApiKey } from "../settings";
const debugModule = Debug("backend:server");

const onError = (error: any) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind: string =
    typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind: string =
    typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  debugModule("Listening on " + bind);
};

const normalizePort = (val: string) => {
  const _port = parseInt(val, 10);

  if (isNaN(_port)) {
    // named pipe
    return val;
  }

  if (_port >= 0) {
    // port number
    return _port;
  }

  return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

export const web3 = createAlchemyWeb3(
  "https://polygon-mainnet.g.alchemy.com/v2/" + alchemyApiKey
);

/**
 * Create HTTP server.
 */

const server: Server = createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
