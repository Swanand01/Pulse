import express from "express";
import { registerStaticRoutes } from "./routes/static";
import iceRouter from "./routes/ice";
import { createServer } from "./server";
import { attachSocketHandlers } from "./socket";
import { attachTracker } from "./tracker";

const PORT = parseInt(process.env.PORT ?? "3001", 10);

const { app, server } = createServer();
attachSocketHandlers(server);
attachTracker(server);
app.use(express.json());
app.use(iceRouter);
registerStaticRoutes(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
