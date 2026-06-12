import { FastifyInstance } from 'fastify';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { PrismaClient } from '@eventlit/database';

const prisma = new PrismaClient();
const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const checkoutQueue = new Queue('ticket-checkout-queue', { connection: redisConnection });

export async function ticketRoutes(fastify: FastifyInstance) {

  // 1. FLASH SALE QUEUE INGESTION: Routes traffic directly into BullMQ
  fastify.post('/tickets/checkout-request', async (request, reply) => {
    const { userId, eventId, tierId, count } = request.body as {
      userId: string; eventId: string; tierId: string; count: number;
    };

    // Push into high-speed FIFO holding queue to guarantee database protection
    const job = await checkoutQueue.add(`order:${userId}:${Date.now()}`, {
      userId,
      eventId,
      tierId,
      count
    }, { attempts: 3, backoff: 1000 });

    return reply.status(202).send({
      message: 'Position queued successfully in holding room.',
      ticketTrackingId: job.id
    });
  });

  // 2. PRE-ORDER PURCHASE PROCESSING
  fastify.post('/tickets/pre-order', async (request, reply) => {
    const { userId, eventId, tierId, totalCents } = request.body as {
      userId: string; eventId: string; tierId: string; totalCents: number;
    };

    const tier = await prisma.ticketTier.findUnique({ where: { id: tierId } });

    if (!tier || !tier.isPreOrder) {
      return reply.status(400).send({ error: 'This ticket tier does not support pre-orders.' });
    }

    const preOrder = await prisma.order.create({
      data: {
        eventId,
        userId,
        status: 'PRE_ORDERED', // Flagged pending release distribution windows
        totalAmount: totalCents
      }
    });

    return reply.status(201).send({ status: 'pre-order-secured', orderId: preOrder.id });
  });
}
