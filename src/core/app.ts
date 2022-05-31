import express, { Application } from "express";
import morgan from "morgan";

import routes from "../routes";

const initializeServer = (): Application => {
  const app = express();

  app.use(express.json());
  app.use(
    morgan("combined", {
      stream: { write: (message) => console.info(message) }
    })
  );

  routes(app);

  return app;
};

export default initializeServer;
