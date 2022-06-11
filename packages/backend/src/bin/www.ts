#!/usr/bin/env node

/**
 * Module dependencies.
 */
import app from "../app";
import Debug from "debug";
import { createServer, Server } from "http";
import Web3 from "web3";
import { infuraProjectId, ankrApiKey } from "../settings";
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

const ANKR =
  `wss://rpc.ankr.com/polygon/ws/` + ankrApiKey;
const INFURA =
  `https://polygon-mainnet.infura.io/v3/` + infuraProjectId;

// Init new web3 clients with Ankr. and Infura
const ANKR_WSS = new Web3.providers.WebsocketProvider(ANKR, {
  reconnect: {
    auto: true,
    delay: 5000, // ms
    onTimeout: true,
    maxAttempts: 10,
  },
  clientConfig: {
    maxReceivedFrameSize: 10000000000,
    maxReceivedMessageSize: 10000000000,
  }
});
export const web3 = new Web3(ANKR_WSS);
export const web3Infura = new Web3(INFURA);
export const checkConnection = (snd: boolean) => {
  web3Infura.eth.net
    .isListening()
    .then(() => { if (snd) console.log("[HTTP] Infura is connected"); })
    .catch((e) => {
      console.log("[HTTP] Lost connection to the node, reconnecting");
      web3.setProvider(INFURA);
    });
  web3.eth.net
    .isListening()
    .then(() => { if (snd) console.log("[WSS] Ankr is connected"); })
    .catch((e) => {
      console.log("[WSS] Lost connection to the node, reconnecting");
      web3.setProvider(ANKR_WSS);
    });
};
checkConnection(true);

/**
 * Create HTTP server.
 */

const server: Server = createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
