export const SUBSCRIPTION_PLANS = {
  LIT_FAN: {
    name: 'Lit Fan Pass',
    priceMonthlyCents: 999,
    features: {
      queuePriority: true,
      freeRaffleEntriesPerEvent: 2,
      unlimitedLivestreams: true,
      geminiAiPriceOptimization: false,
    }
  },
  ORGANIZER_PRO: {
    name: 'Lit Organizer Pro',
    priceMonthlyCents: 4999,
    features: {
      queuePriority: false,
      freeRaffleEntriesPerEvent: 0,
      unlimitedLivestreams: false,
      geminiAiPriceOptimization: true,
      unlimitedPreOrders: true,
      maxSocialContracts: 1,
    }
  },
  FESTIVAL_SCALE: {
    name: 'Festival Scale',
    priceMonthlyCents: 14999,
    features: {
      queuePriority: false,
      freeRaffleEntriesPerEvent: 0,
      unlimitedLivestreams: false,
      geminiAiPriceOptimization: true,
      unlimitedPreOrders: true,
      maxSocialContracts: 999,
      zeroResaleFees: true,
      biAnnualAiPromos: true,
    }
  }
};
