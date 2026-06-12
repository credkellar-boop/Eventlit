import { FastifyRequest, FastifyReply } from 'fastify';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * High-Speed Redis Token Bucket Rate Limiter
 * Restricts rapid API spam requests to preserve server processing speeds
 */
export async function rateLimiterGuard(request: FastifyRequest, reply: FastifyReply) {
  const ip = request.ip;
  const redisKey = `ratelimit:${ip}`;
  
  const maxRequestsAllowed = 100; 
  const windowSeconds = 60; // 100 requests per minute ceiling

  const currentRequestsCount = await redis.incr(redisKey);

  if (currentRequestsCount === 1) {
    // New window tracking sequence established, assign time-to-live expiration
    await redis.expire(redisKey, windowSeconds);
  }

  if (currentRequestsCount > maxRequestsAllowed) {
    return reply.status(429).send({
      error: 'Too Many Requests',
      message: 'Checkout velocity exceeded limits. Request throttled to protect system stability.'
    });
  }
}
