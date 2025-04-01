# Webdeeds JS

A JavaScript client library and wallet implementation for the Webdeeds Production API. This library provides developers with simple yet flexible tools to interact with the Webdeeds platform and manage digital assets securely.

## IMPORTANT: Proceed with caution.

[Webdeeds.org](https://webdeeds.org) is in a very experimental stage of development. There is a lot of testing to be done before this system is ready to be used in production environments or systems.

## Features

- **Full API Client**: Communicate with the Webdeeds server
- **Secure Wallet Implementation**: Create, manage, and transact with digital assets
- **TypeScript Support**: Fully typed API for improved developer experience
- **Cross-Platform**: Works in Node.js and browser environments
- **Flexible Storage**: Multiple persistence options for wallet data

## Installation

```bash
# Using npm
npm install webdeeds-js

# Using yarn
yarn add webdeeds-js

# Using pnpm
pnpm add webdeeds-js
```

## Quick Start

### Basic Client Usage

```typescript
import { WebdeedsClient } from "webdeeds-js";

const client = new WebdeedsClient({
  baseUrl: "https://api.webdeeds.org",
});

async function createDeed() {
  try {
    const response = await client.mint.create({
      metadata: {
        name: "Golden Token",
        description: "A valuable digital asset",
        image: "https://example.com/token.png",
      },
      outputs: ["+100.ID_PLACEHOLDER.your-secret-key"],
    });

    console.log("Created deed with ID:", response.itemId);
    console.log("Outputs:", response.outputs);
  } catch (error) {
    console.error("Error creating deed:", error);
  }
}

createDeed();
```

### Building a Wallet

```typescript
import {
  Wallet,
  FilePersistenceAdapter,
  WebdeedsApiAdapter,
  WebdeedsClient,
} from "webdeeds-js";

const client = new WebdeedsClient();
const apiAdapter = new WebdeedsApiAdapter(client);
const persistenceAdapter = new FilePersistenceAdapter("wallet.dat");
const wallet = new Wallet(persistenceAdapter, apiAdapter);

async function showWalletContents() {
  const items = await wallet.list();
  console.log("Wallet contents:");
  items.forEach((item) => {
    console.log(`- ${item.itemId}: ${item.totalAmount} units`);
  });
}

async function sendAssets(itemId, amount) {
  try {
    const outputToSend = await wallet.send(itemId, amount);
    console.log("Output to send to recipient:", outputToSend);
    return outputToSend;
  } catch (error) {
    console.error("Error sending assets:", error);
    throw error;
  }
}

async function receiveAssets(outputStrings) {
  try {
    await wallet.receive(outputStrings);
    console.log("Assets received successfully");
  } catch (error) {
    console.error("Error receiving assets:", error);
    throw error;
  }
}
```

## Common Operations

### Creating a Swap

```typescript
const response = await client.swap.create({
  inputs: [
    "+50.deed_abc123.your-secret-key-1",
    "+25.deed_abc123.your-secret-key-2",
  ],
  outputs: ["+75.deed_abc123.recipient-secret-key"],
});

console.log("Swap completed:", response);
```

### Querying the Registry

```typescript
const deedInfo = await client.registry.getItemById("deed_abc123");
console.log("Deed information:", deedInfo);
```

## API Reference

### WebdeedsClient

#### Configuration

```typescript
const client = new WebdeedsClient({
  baseUrl: "https://api.webdeeds.org",
});
```

#### Available Services

- **mint**: For creating new deeds
- **swap**: For exchanging deeds
- **registry**: For querying the registry

### Wallet

#### Persistence Adapters

- **MemoryPersistenceAdapter**: Stores wallet data in memory (CAREFUL: not persistent)
- **FilePersistenceAdapter**: Stores wallet data in a local file
- **LocalStoragePersistenceAdapter**: Stores wallet data in a browsers [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

```typescript
const persistence = new FilePersistenceAdapter("wallet.dat");
```

#### Secret Management

- **Automatic Secret Generation**: Secrets generated using [randombytes](https://www.npmjs.com/package/randombytes)
- **Secret Rotation**: New secrets generated upon receiving outputs
- **Output Format**: `+amount.itemId.secret`

Example:

```typescript
const outputToSend = await wallet.send(itemId, amount);
await wallet.receive([outputToSend]);
```

**Security Considerations:**

- Always use `wallet.receive` for securing outputs
- Backup wallet data securely; secrets are irrecoverable
- Automatic secret rotation occurs during transfers

#### Core Methods

- **list()**: Lists wallet items
- **send(itemId, amount)**: Creates an output to send
- **receive(outputStrings)**: Secures outputs with new secrets

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm dev
```

## License

MIT
