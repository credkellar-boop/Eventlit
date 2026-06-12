import Fastify from 'fastify';
import Redis from 'ioredis';
import { PrismaClient } from '@eventlit/database';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const server = Fastify({ logger: true });
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Base Core Healthcheck Engine
server.get('/health', async (request, reply) => {
  try {
    // Quick validation across downstream databases
    await prisma.$queryRaw`SELECT 1`;
    const redisPing = await redis.ping();
    
    return { 
      status: 'healthy', 
      database: 'connected', 
      redis: redisPing === 'PONG' ? 'connected' : 'error' 
    };
  } catch (error) {
    server.log.error(error);
    return reply.status(500).send({ status: 'unhealthy', error: 'Dependency connection failure' });
  }
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 4000;
    await server.listen({ port, host: '0.0.0.0' });
    server.log.info(`⚡ Eventlit Core API spinning at http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
