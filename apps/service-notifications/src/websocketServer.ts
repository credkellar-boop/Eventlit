import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const server = Fastify();
server.register(fastifyWebsocket);

const redisSubscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const connectedClients = new Set<any>();

// Subscribing to Eventlit global transaction & system notifications
redisSubscriber.subscribe('waitlist-updates', 'raffle-broadcasts', (err) => {
  if (err) console.error('Subscription error context:', err);
});

redisSubscriber.on('message', (channel, message) => {
  const outboundPayload = JSON.stringify({ channel, data: JSON.parse(message) });
  for (const client of connectedClients) {
    client.send(outboundPayload);
  }
});

server.register(async (fastify) => {
  fastify.get('/stream/updates', { websocket: true }, (connection, req) => {
    connectedClients.add(connection.socket);
    fastify.log.info('🌐 Client securely connected to Eventlit live socket wire.');

    connection.socket.on('close', () => {
      connectedClients.delete(connection.socket);
    });
  });
});

const run = async () => {
  try {
    await server.listen({ port: 5001, host: '0.0.0.0' });
    console.log('🛰️ Eventlit WebSockets streaming alive at http://localhost:5001');
  } catch (err) {
    process.exit(1);
  }
};
run();
