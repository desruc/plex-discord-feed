import "dotenv/config";

import env from "./core/env";
import initializeServer from "./core/app";

process.on("unhandledRejection", (e) => {
  console.error("UNHANDLED_REJECTION: ", e);
});

process.on("uncaughtException", (e) => {
  console.error("UNCAUGHT_EXCEPTION: ", e);
  console.log("NODE_WARN: ", {
    stack: "Uncaught Exception detected. Restarting..."
  });
  process.exit(1);
});

const initializeApp = async (): Promise<void> => {
  const server = initializeServer();

  server.listen(env.PORT, () => {
    console.info(`Server listening on port ${env.PORT}`);
  });
};

/* eslint-disable-next-line @typescript-eslint/no-floating-promises */
initializeApp();
