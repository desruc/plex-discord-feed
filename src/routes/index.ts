import { Application } from "express";
import multer from "multer";
import * as plexWebhooks from "../controllers/plexWebhooks";

const upload = multer({ storage: multer.memoryStorage() });

export const attachRoutes = (app: Application): void => {
  app.use("/status", (_, res) => res.json({ status: "Alive and kicking" }));
  app.use("/plex-event", upload.single("thumb"), plexWebhooks.handleEvent);
};

export default attachRoutes;
