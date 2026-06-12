import { GoogleGenAI } from '@google/genai';
import { PrismaClient } from '@eventlit/database';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const prisma = new PrismaClient();

/**
 * AI Profit Maximizer: Analyzes sales velocity and updates early-bird/VIP prices
 */
export async function optimizeTicketPrices(eventId: string) {
  const eventData = await prisma.event.findUnique({
    where: { id: eventId },
    include: { ticketTiers: true, orders: true }
  });

  if (!eventData) return;

  const prompt = `
    Analyze this ticketing data for "${eventData.title}":
    Tiers: ${JSON.stringify(eventData.ticketTiers)}
    Total Orders: ${eventData.orders.length}
    
    Act as a dynamic pricing specialist. To maximize total profit without killing momentum, 
    recommend a price adjustment factor (e.g., 1.15 for a 15% increase, or 0.95 for a drop).
    Respond strictly in valid JSON format: { "tierId": "string", "adjustmentFactor": number, "reasoning": "string" }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  const recommendation = JSON.parse(response.text || '{}');
  
  // Apply the Gemini-calculated surge/discount pricing dynamically
  if (recommendation.tierId && recommendation.adjustmentFactor) {
    const tier = eventData.ticketTiers.find(t => t.id === recommendation.tierId);
    if (tier) {
      const newPrice = Math.round(tier.price * recommendation.adjustmentFactor);
      await prisma.ticketTier.update({
        where: { id: tier.id },
        data: { price: newPrice }
      });
    }
  }
}

/**
 * Semi-Annual Promotional Deal Generator (Triggers every 6 months)
 */
export async function generateBiAnnualPromos(organizerId: string) {
  const events = await prisma.event.findMany({ where: { organizerId } });
  
  const prompt = `
    Based on these events run over the last 6 months: ${JSON.stringify(events)}, 
    generate 3 highly tailored promotional deals, bundle packages, or holiday campaigns 
    to maximize revenue for the next 6 months. Output a clean markdown action plan.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
  });

  return response.text; // Returns custom markdown promotion blueprints
}
