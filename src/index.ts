import "dotenv/config";

import env from "~/core/env";
import initializeServer from "~/core/app";
import { logger } from "~/core/logger";

process.on("unhandledRejection", (error) => {
  logger.error("UNHANDLED_REJECTION", { error });
});

process.on("uncaughtException", (error) => {
  logger.error("UNCAUGHT_EXCEPTION", { error });

  logger.warn("NODE_WARN: ", {
    stack: "Uncaught Exception detected. Restarting..."
  });

  process.exit(1);
});

const initializeApp = async (): Promise<void> => {
  const server = initializeServer();

  server.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT}`, { port: env.PORT });
  });
};

initializeApp();
