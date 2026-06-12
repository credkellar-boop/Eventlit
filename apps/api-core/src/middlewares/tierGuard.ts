import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient, SubscriptionTier, SubStatus } from '@eventlit/database';

const prisma = new PrismaClient();

export function requireSubscriptionTier(allowedTiers: SubscriptionTier[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.headers['x-user-id'] as string;

    if (!userId) {
      return reply.status(401).send({ error: 'Missing account authorization context.' });
    }

    const sub = await prisma.subscription.findUnique({ where: { userId } });

    const isAuthorized = sub && 
                         sub.status === SubStatus.ACTIVE && 
                         allowedTiers.includes(sub.tier) && 
                         new Date() < sub.currentPeriodEnd;

    if (!isAuthorized) {
      return reply.status(403).send({ 
        error: 'Access denied.', 
        message: `This high-performance module requires an active subscription tier: [${allowedTiers.join(', ')}]` 
      });
    }
  };
}
