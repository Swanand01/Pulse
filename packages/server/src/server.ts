import http from "node:http";
import express, { type Express } from "express";

export interface AppServer {
  app: Express;
  server: http.Server;
}

export function createServer(): AppServer {
  const app = express();
  const server = http.createServer(app);
  return { app, server };
}
