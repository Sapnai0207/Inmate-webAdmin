import cors from "cors";

import express from "express";
import { getLogger } from "log4js";
import next from "next";
import api from "./routes/index";
import http from "http";
import { loggerMiddleware } from "./services/logger";

const logger = getLogger("http");

const dev = process.env.NODE_ENV !== "production";
const PORT: string | number = process.env.PORT ?? 3000;
const { BASE_PATH = "rest" } = process.env;

logger.info("dev", dev);
const app = next({ dev });
const handle = app.getRequestHandler();

const main = async (): Promise<void> => {
  console.log("starting");
  await app
    .prepare()
    .then(() => {
      const server = express();
      const httpServer = http.createServer(server);
      api.use(loggerMiddleware);

      server.use(`${BASE_PATH}`, api);
      server.use(
        cors({
          origin: "*",
        })
      );
      server.all("*", (req, res, next) => {
        handle(req, res).catch((e) => next(e));
      });
      server.listen(PORT, () => {
        console.log(PORT, BASE_PATH);
        logger.info(`Server running on http://localhost:${PORT}/${BASE_PATH}`);
      });
    })
    .catch((e) => {});
};

main().catch((e) => {
  logger.error("server startup error", e);
});
