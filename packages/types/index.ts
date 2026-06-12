import { SubscriptionTier, OrderStatus } from '@eventlit/database';

export interface CheckoutJobPayload {
  userId: string;
  eventId: string;
  tierId: string;
  count: number;
}

export interface WebSocketEvent<T = any> {
  channel: 'waitlist-updates' | 'raffle-broadcasts' | 'stream-telemetry';
  data: T;
}

export interface LiveRaffleWinnerPayload {
  eventId: string;
  winnerTicketId: string;
  winnerName: string;
  winnerEmail: string | undefined;
}

export interface UserSubscriptionContext {
  userId: string;
  tier: SubscriptionTier;
  isActive: boolean;
  currentPeriodEnd: string;
}
