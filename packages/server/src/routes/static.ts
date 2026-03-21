import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type Express } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_DIST = path.resolve(__dirname, "../../client/dist");

export function registerStaticRoutes(app: Express): void {
  app.use(express.static(CLIENT_DIST));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
}
