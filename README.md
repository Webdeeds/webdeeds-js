# Webdeeds JavaScript Client

A JavaScript/TypeScript client library for interacting with the Webdeeds API.

## Installation

```bash
npm install webdeeds
# or
yarn add webdeeds
# or
pnpm add webdeeds
```

## Usage

### Initialize the client

```typescript
import WebdeedsClient from "webdeeds";

const client = new WebdeedsClient({
  baseUrl: "http://localhost:3000", // Default value
  apiToken: "your-api-token-here",
});
```

### Mint API

Create a new mint request:

```typescript
const mintResponse = await client.mint.createMint({
  metadata: {
    name: "Red Rubies",
    description: "Precious gemstones",
    image: "https://picsum.photos/800",
  },
  outputs: [
    "+1.ID_PLACEHOLDER.test-secret-replace-me-2",
    "+999999.ID_PLACEHOLDER.test-secret-replace-me-1",
  ],
});

console.log(mintResponse.itemId);
console.log(mintResponse.outputs);
```

### Swap API

Create a new swap request:

```typescript
const swapResponse = await client.swap.createSwap({
  inputs: [
    "+1.deed_XXXXXXXXXXXXXXXXXXXXXXXXX.test-secret-replace-me-2",
    "+999999.deed_XXXXXXXXXXXXXXXXXXXXXXXXX.test-secret-replace-me-1",
  ],
  outputs: ["+1000000.deed_XXXXXXXXXXXXXXXXXXXXXXXXX.test-secret-replace-me-3"],
});

console.log(swapResponse.success);
```

### Registry API

Get an item by ID:

```typescript
const item = await client.registry.getItemById(
  "deed_XXXXXXXXXXXXXXXXXXXXXXXXX"
);

console.log(item.id);
console.log(item.total);
console.log(item.metadata);
```

## API Reference

### Client Configuration

```typescript
interface WebdeedsConfig {
  baseUrl: string;
  apiToken?: string;
}
```

### Types

#### Metadata

```typescript
interface Metadata {
  name?: string;
  description?: string;
  image?: string;
}
```

#### Mint Request/Response

```typescript
interface MintRequest {
  metadata?: Metadata;
  outputs: string[];
}

interface MintResponse {
  itemId: string;
  outputs: string[];
}
```

#### Swap Request/Response

```typescript
interface SwapRequest {
  inputs: string[];
  outputs: string[];
}

interface SwapResponse {
  success: boolean;
}
```

#### Registry Item

```typescript
interface RegistryItem {
  id: string;
  total: number;
  metadata?: Metadata;
}
```

## Error Handling

The client throws errors for API requests that fail. You should wrap your API calls in try/catch blocks:

```typescript
try {
  const response = await client.mint.createMint({
    outputs: ["..."],
  });
} catch (error) {
  console.error("API request failed:", error);
}
```
