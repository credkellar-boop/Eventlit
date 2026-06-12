import { FastifyInstance } from 'fastify';
import { PrismaClient, SubscriptionTier, SubStatus } from '@eventlit/database';

const prisma = new PrismaClient();

export async function subscriptionRoutes(fastify: FastifyInstance) {
  
  // Activate or mock upgrade a subscription tier
  fastify.post('/subscription/checkout', async (request, reply) => {
    const { userId, tier } = request.body as { userId: string; tier: SubscriptionTier };

    const expiration = new String(new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString());

    const sub = await prisma.subscription.upsert({
      where: { userId },
      update: {
        tier,
        status: SubStatus.ACTIVE,
        currentPeriodEnd: new Date(expiration.toString())
      },
      create: {
        userId,
        tier,
        status: SubStatus.ACTIVE,
        currentPeriodEnd: new Date(expiration.toString())
      }
    });

    return { status: 'success', subscription: sub };
  });

  // Internal verification hook to read a user's subscription standing
  fastify.get('/subscription/status/:userId', async (request, reply) => {
    const { userId } = request.params as { userId: string };

    const sub = await prisma.subscription.findUnique({ where: { userId } });
    
    if (!sub || sub.status !== SubStatus.ACTIVE || new Date() > sub.currentPeriodEnd) {
      return { tier: SubscriptionTier.NONE, active: false };
    }

    return { tier: sub.tier, active: true };
  });
}
