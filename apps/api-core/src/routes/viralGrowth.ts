import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@eventlit/database';

const prisma = new PrismaClient();

export async function viralGrowthRoutes(fastify: FastifyInstance) {
  
  // 1. REFERRAL CHECKOUT LOOP: Buy 3, Get 1 Free Tracking
  fastify.post('/referrals/track', async (request, reply) => {
    const { referrerId, buyerId, eventId, tierId } = request.body as {
      referrerId: string; buyerId: string; eventId: string; tierId: string;
    };

    // Log the successful referral link purchase
    await prisma.referral.create({ data: { referrerId, buyerId } });

    // Check if the referrer hit a milestone of 3 successful buyer referrals
    const successfulReferralsCount = await prisma.referral.count({
      where: { referrerId }
    });

    if (successfulReferralsCount > 0 && successfulReferralsCount % 3 === 0) {
      // Award 1 free ticket via an automatic completed order
      await prisma.order.create({
        data: {
          eventId,
          userId: referrerId,
          status: 'COMPLETED',
          totalAmount: 0 // Free Ticket Milestone!
        }
      });
      return { status: 'success', milestoneReached: true, message: 'Free ticket awarded for 3 referrals!' };
    }

    return { status: 'success', milestoneReached: false };
  });

  // 2. VIRAL SOCIAL INCENTIVE ENGINE
  fastify.post('/promo/claim-views', async (request, reply) => {
    const { userId, platform, postUrl, verifiedViews, eventId } = request.body as {
      userId: string; platform: string; postUrl: string; verifiedViews: number; eventId: string;
    };

    let ticketsToAward = 0;

    // Viral milestones logic
    if (verifiedViews >= 1000000) {
      ticketsToAward = 100; // 1 Million views = 100 free tickets
    } else if (verifiedViews >= 100000) {
      ticketsToAward = 10;  // 100k views = 10 free tickets
    }

    if (ticketsToAward > 0) {
      await prisma.socialPromoClaim.create({
        data: { userId, platform, postUrl, viewCount: verifiedViews, ticketsWon: ticketsToAward }
      });

      // Credit the free tickets straight into their Eventlit wallet/account
      for (let i = 0; i < ticketsToAward; i++) {
        await prisma.order.create({
          data: { eventId, userId, status: 'COMPLETED', totalAmount: 0 }
        });
      }
      return { status: 'claimed', freeTicketsAwarded: ticketsToAward };
    }

    return reply.status(400).send({ error: 'View count milestone minimum not reached.' });
  });
}
