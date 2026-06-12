import Fastify, { FastifyInstance } from 'fastify';
import { subscriptionRoutes } from './routes/subscriptions.js';
import { secondaryMarketRoutes } from './routes/secondaryMarket.js';
import { viralGrowthRoutes } from './routes/viralGrowth.js';
import { livestreamRoutes } from './routes/livestream.js';
import { ticketRoutes } from './routes/tickets.js';

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  // Standard Global Middleware Hooks & Security Registries can be loaded here
  app.get('/api/v1/ping', async () => ({ pong: true, timestamp: Date.now() }));

  // Register Eventlit Application Distributed Micro-Routing Fabrics
  app.register(subscriptionRoutes, { prefix: '/api/v1' });
  app.register(secondaryMarketRoutes, { prefix: '/api/v1' });
  app.register(viralGrowthRoutes, { prefix: '/api/v1' });
  app.register(livestreamRoutes, { prefix: '/api/v1' });
  app.register(ticketRoutes, { prefix: '/api/v1' });

  return app;
}
