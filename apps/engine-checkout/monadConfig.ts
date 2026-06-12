export const MONAD_TPS_TARGET = 10000;

export const monadEngineConfig = {
  network: {
    name: "Monad Devnet",
    rpcUrl: process.env.NEXT_PUBLIC_EVM_RPC_URL || "https://rpc.devnet.monad.xyz",
    chainId: 2026, // Monad specific execution environment
  },
  throughputOptimization: {
    // Leverage Monad db parallel input/output states
    parallelExecutionWorkers: 32, 
    batchSizePerBlock: 500,
    timeoutMs: 50, // Ultra low-latency checkout lock target
  },
  gasLimitAllocation: {
    ticketMintGasCost: 85000, 
    maxPriorityFeePerGas: "100000000", // Fast-track high demand drops
  }
};

/**
 * Formats data chunks for rapid parallel contract execution pipelines on Monad
 */
export function chunkTicketingPayloads<T>(transactions: T[]): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < transactions.length; i += monadEngineConfig.throughputOptimization.batchSizePerBlock) {
    chunks.push(transactions.slice(i, i + monadEngineConfig.throughputOptimization.batchSizePerBlock));
  }
  return chunks;
}
