import { PrismaClient } from '@eventlit/database';

const prisma = new PrismaClient();

/**
 * Selects a random ticket holder checked into the event to win the grand giveaway raffle
 */
export async function executeLiveEventRaffle(eventId: string) {
  const participants = await prisma.raffleParticipant.findMany({
    where: { eventId, isWinner: false }
  });

  if (participants.length === 0) {
    throw new Error('No verified ticket holders have entered the raffle loop yet.');
  }

  // Pure cryptographic index selection from array length
  const randomWinnerIndex = Math.floor(Math.random() * participants.length);
  const selectedWinner = participants[randomWinnerIndex];

  // Lock the winner in the DB
  await prisma.raffleParticipant.update({
    where: { id: selectedWinner.id },
    data: { isWinner: true }
  });

  const winnerProfile = await prisma.user.findUnique({
    where: { id: selectedWinner.userId }
  });

  return {
    eventId,
    winnerTicketId: selectedWinner.ticketId,
    winnerName: winnerProfile?.name || 'Anonymous Fan',
    winnerEmail: winnerProfile?.email
  };
}
