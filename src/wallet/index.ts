// Export the main wallet class
export { Wallet, WalletItem } from "./wallet";

// Export domain entities
export { Output } from "./core/output";
export { Secret } from "./core/secret";

// Export persistence adapters
export { PersistenceAdapter } from "./adapters/persistence/persistence-adapter.interface";
export { MemoryPersistenceAdapter } from "./adapters/persistence/memory-persistence";
export { LocalStoragePersistenceAdapter } from "./adapters/persistence/local-storage-persistence";
export { FilePersistenceAdapter } from "./adapters/persistence/file-persistence";

// Export API adapters
export { WebdeedsApiClient } from "./adapters/api/webdeeds-api-client.interface";
export { WebdeedsApiAdapter } from "./adapters/api/webdeeds-api-adapter";
