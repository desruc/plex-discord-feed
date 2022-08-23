import express, { Application } from "express";
import morgan from "morgan";

import routes from "~/routes";
import { logger } from "./logger";

const initializeServer = (): Application => {
  const app = express();

  app.use(express.json());
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message) }
    })
  );

  routes(app);

  return app;
};

export default initializeServer;
