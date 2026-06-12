import { buildApp } from './app.js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const startServer = async () => {
  const app = buildApp();
  const port = Number(process.env.PORT) || 4000;

  try {
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`🔥 Eventlit Main Cluster active at host pipeline: http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
