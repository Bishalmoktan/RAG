import { cpus } from "os";
import cluster from "cluster";

import { app } from "./app.js";
import config from "./config/index.js";
import { logger } from "./logging/logger.js";
import { initDatabase } from "./db/setupDb.js";

const PORT = config.app.port;
const isProduction = config.app.isProduction;

if (isProduction) {
  const numCpus = cpus().length;

  if (cluster.isPrimary) {
    logger.info(
      `Master thread is running on process: ${process.pid}, on port: ${PORT}`
    );
    for (let i = 0; i < numCpus; i++) {
      cluster.fork();
    }

    cluster.on("exit", () => {
      cluster.fork();
    });
  } else {
    app.listen(PORT, async () => {
      logger.info(`Production server is running on ${process.pid}`);
      await initDatabase();
    });
  }
} else {
  app.listen(PORT, async () => {
    logger.info(`Development server is running at: ${PORT}`);
    await initDatabase();
  });
}
