export * from "./client";

// Export the main wallet class
export { Wallet, WalletItem } from "./wallet";

// Export domain entities
export { Output } from "./wallet/core/output";
export { Secret } from "./wallet/core/secret";

// Export persistence adapters
export { PersistenceAdapter } from "./wallet/adapters/persistence/persistence-adapter.interface";
export { MemoryPersistenceAdapter } from "./wallet/adapters/persistence/memory-persistence";
export { LocalStoragePersistenceAdapter } from "./wallet/adapters/persistence/local-storage-persistence";

// Export API adapters
export { WebdeedsApiClient } from "./wallet/adapters/api/webdeeds-api-client.interface";
export { WebdeedsApiAdapter } from "./wallet/adapters/api/webdeeds-api-adapter";
