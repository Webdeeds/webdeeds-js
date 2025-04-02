var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node-stub:crypto
var crypto_exports = {};
__export(crypto_exports, {
  default: () => crypto_default
});
var crypto_default;
var init_crypto = __esm({
  "node-stub:crypto"() {
    "use strict";
    crypto_default = {};
  }
});

// src/client/config.ts
var DEFAULT_CONFIG = {
  baseUrl: "https://api.webdeeds.org"
};

// src/client/client.ts
var ApiClient = class {
  constructor(config = {}) {
    this.config = __spreadValues(__spreadValues({}, DEFAULT_CONFIG), config);
  }
  getHeaders() {
    const headers = {
      "Content-Type": "application/json"
    };
    return headers;
  }
  request(endpoint, method = "GET", body) {
    return __async(this, null, function* () {
      const url = `${this.config.baseUrl}${endpoint}`;
      const options = {
        method,
        headers: this.getHeaders()
      };
      if (body) {
        options.body = JSON.stringify(body);
      }
      const response = yield fetch(url, options);
      if (!response.ok) {
        const errorText = yield response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }
      const data = yield response.json();
      return data;
    });
  }
  get(endpoint) {
    return __async(this, null, function* () {
      return this.request(endpoint, "GET");
    });
  }
  post(endpoint, body) {
    return __async(this, null, function* () {
      return this.request(endpoint, "POST", body);
    });
  }
};

// src/client/services/mint.ts
var MintService = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Create a new mint request
   * @param request The mint request data
   * @returns A promise that resolves to the mint response
   */
  create(request) {
    return __async(this, null, function* () {
      return this.client.post("/v1/mint", request);
    });
  }
};

// src/client/services/swap.ts
var SwapService = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Create a new swap request
   * @param request The swap request data
   * @returns A promise that resolves to the swap response
   */
  create(request) {
    return __async(this, null, function* () {
      return this.client.post("/v1/swap", request);
    });
  }
};

// src/client/services/registry.ts
var RegistryService = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Get registry item by ID
   * @param itemId The ID of the item to retrieve
   * @returns A promise that resolves to the registry item
   */
  getItemById(itemId) {
    return __async(this, null, function* () {
      return this.client.get(`/v1/item/${itemId}`);
    });
  }
};

// src/client/index.ts
var WebdeedsClient = class {
  constructor(config = {}) {
    this.client = new ApiClient(config);
    this.mint = new MintService(this.client);
    this.swap = new SwapService(this.client);
    this.registry = new RegistryService(this.client);
  }
};
var client_default = WebdeedsClient;

// src/wallet/core/secret.ts
function getRandomBytes(size) {
  if (typeof window !== "undefined" && window.crypto) {
    return window.crypto.getRandomValues(new Uint8Array(size));
  } else if (typeof __require !== "undefined") {
    const crypto = (init_crypto(), __toCommonJS(crypto_exports));
    return crypto.randomBytes(size);
  } else {
    throw new Error("No crypto implementation available");
  }
}
var Secret = class _Secret {
  constructor(value) {
    this.value = value || _Secret.generate();
  }
  /**
   * Generate a new random secret
   * Using cryptographically secure random bytes
   */
  static generate() {
    return Array.from(getRandomBytes(16)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  toString() {
    return this.value;
  }
  getValue() {
    return this.value;
  }
};

// src/wallet/core/output.ts
var Output = class _Output {
  constructor(amount, itemId, secret) {
    this.amount = amount;
    this.itemId = itemId;
    this.secret = secret;
  }
  /**
   * Parse a deed output string into an Output object
   * @param outputString Format: +amount.itemId.secret
   */
  static fromString(outputString) {
    const matches = outputString.match(/^\+(\d+)\.([^.]+)\.(.+)$/);
    if (!matches) {
      throw new Error(`Invalid output format: ${outputString}`);
    }
    const [, amountStr, itemId, secretValue] = matches;
    const amount = parseInt(amountStr, 10);
    return new _Output(amount, itemId, new Secret(secretValue));
  }
  /**
   * Convert the Output to its string representation
   */
  toString() {
    return `+${this.amount}.${this.itemId}.${this.secret.toString()}`;
  }
  getAmount() {
    return this.amount;
  }
  getItemId() {
    return this.itemId;
  }
  getSecret() {
    return this.secret;
  }
  /**
   * Create a new Output with the same amount and itemId but a new secret
   */
  withNewSecret(newSecret) {
    return new _Output(this.amount, this.itemId, newSecret || new Secret());
  }
};

// src/wallet/adapters/persistence/memory-persistence.ts
var MemoryPersistenceAdapter = class {
  constructor(initialOutputs = []) {
    this.outputs = [];
    this.outputs = [...initialOutputs];
  }
  getOutputs() {
    return __async(this, null, function* () {
      return [...this.outputs];
    });
  }
  saveOutputs(outputs) {
    return __async(this, null, function* () {
      this.outputs = [...outputs];
    });
  }
  addOutputs(outputs) {
    return __async(this, null, function* () {
      this.outputs = [...this.outputs, ...outputs];
    });
  }
  removeOutputs(outputsToRemove) {
    return __async(this, null, function* () {
      const outputStrings = outputsToRemove.map((output) => output.toString());
      this.outputs = this.outputs.filter(
        (output) => !outputStrings.includes(output.toString())
      );
    });
  }
  clear() {
    return __async(this, null, function* () {
      this.outputs = [];
    });
  }
};

// src/wallet/adapters/api/webdeeds-api-adapter.ts
var WebdeedsApiAdapter = class {
  constructor(client) {
    this.client = client;
  }
  /**
   * Execute a swap operation
   * @param inputs Input deeds with secrets
   * @param outputs Output deeds with new secrets
   * @returns True if the swap was successful
   */
  swap(inputs, outputs) {
    return __async(this, null, function* () {
      const response = yield this.client.swap.create({
        inputs,
        outputs
      });
      return response.success;
    });
  }
};

// src/wallet/wallet.ts
var Wallet = class {
  constructor(persistence = new MemoryPersistenceAdapter(), apiClient = new WebdeedsApiAdapter(new client_default())) {
    this.persistence = persistence;
    this.apiClient = apiClient;
  }
  /**
   * List all items in the wallet, grouped by item ID
   * @returns A list of wallet items with their total amounts
   */
  list() {
    return __async(this, null, function* () {
      const outputs = yield this.persistence.getOutputs();
      const outputsByItemId = {};
      for (const output of outputs) {
        const itemId = output.getItemId();
        if (!outputsByItemId[itemId]) {
          outputsByItemId[itemId] = [];
        }
        outputsByItemId[itemId].push(output);
      }
      const result = [];
      for (const itemId in outputsByItemId) {
        if (Object.prototype.hasOwnProperty.call(outputsByItemId, itemId)) {
          const itemOutputs = outputsByItemId[itemId];
          const totalAmount = itemOutputs.reduce(
            (sum, output) => sum + output.getAmount(),
            0
          );
          result.push({
            itemId,
            totalAmount
          });
        }
      }
      return result;
    });
  }
  /**
   * Send a specific amount of an item
   * @param itemId The ID of the item to send
   * @param amount The amount to send
   * @returns The output that is ready to be sent to the recipient
   */
  send(itemId, amount) {
    return __async(this, null, function* () {
      if (amount <= 0) {
        throw new Error("Amount must be greater than zero");
      }
      const walletOutputs = yield this.persistence.getOutputs();
      const itemOutputs = walletOutputs.filter(
        (output) => output.getItemId() === itemId
      );
      const totalAvailable = itemOutputs.reduce(
        (sum, output) => sum + output.getAmount(),
        0
      );
      if (totalAvailable < amount) {
        throw new Error(
          `Insufficient amount available. Requested: ${amount}, Available: ${totalAvailable}`
        );
      }
      const { selectedOutputs, selectedAmount } = this.selectOutputs(
        itemOutputs,
        amount
      );
      const outputSecret = new Secret();
      const changeSecret = new Secret();
      const inputs = selectedOutputs.map((output) => output.toString());
      const swapOutputs = [];
      swapOutputs.push(`+${amount}.${itemId}.${outputSecret.toString()}`);
      if (selectedAmount > amount) {
        const changeAmount = selectedAmount - amount;
        swapOutputs.push(`+${changeAmount}.${itemId}.${changeSecret.toString()}`);
      }
      const success = yield this.apiClient.swap(inputs, swapOutputs);
      if (!success) {
        throw new Error("Swap operation failed");
      }
      yield this.persistence.removeOutputs(selectedOutputs);
      if (selectedAmount > amount) {
        const changeAmount = selectedAmount - amount;
        const changeOutput = new Output(changeAmount, itemId, changeSecret);
        yield this.persistence.addOutputs([changeOutput]);
      }
      return `+${amount}.${itemId}.${outputSecret.toString()}`;
    });
  }
  /**
   * Receive outputs and secure them by updating the secrets
   * @param outputStrings Array of output strings to receive
   * @returns True if all outputs were successfully received
   */
  receive(outputStrings) {
    return __async(this, null, function* () {
      if (!outputStrings.length) {
        return true;
      }
      for (const outputString of outputStrings) {
        const output = Output.fromString(outputString);
        const newSecret = new Secret();
        const newOutput = output.withNewSecret(newSecret);
        const success = yield this.apiClient.swap(
          [outputString],
          [newOutput.toString()]
        );
        if (!success) {
          throw new Error(`Failed to receive output: ${outputString}`);
        }
        yield this.persistence.addOutputs([newOutput]);
      }
      return true;
    });
  }
  /**
   * Helper method to select outputs that sum to at least the required amount
   * @param outputs Available outputs
   * @param requiredAmount The amount needed
   * @returns Selected outputs and their total amount
   */
  selectOutputs(outputs, requiredAmount) {
    const sortedOutputs = [...outputs].sort(
      (a, b) => a.getAmount() - b.getAmount()
    );
    let cumulativeAmount = 0;
    const selectedOutputs = [];
    const exactOutput = sortedOutputs.find(
      (output) => output.getAmount() === requiredAmount
    );
    if (exactOutput) {
      return {
        selectedOutputs: [exactOutput],
        selectedAmount: exactOutput.getAmount()
      };
    }
    const largerOutput = sortedOutputs.find(
      (output) => output.getAmount() > requiredAmount
    );
    if (largerOutput) {
      return {
        selectedOutputs: [largerOutput],
        selectedAmount: largerOutput.getAmount()
      };
    }
    const descendingOutputs = sortedOutputs.reverse();
    for (const output of descendingOutputs) {
      selectedOutputs.push(output);
      cumulativeAmount += output.getAmount();
      if (cumulativeAmount >= requiredAmount) {
        break;
      }
    }
    if (cumulativeAmount < requiredAmount) {
      throw new Error(
        `Insufficient funds. Required: ${requiredAmount}, Available: ${cumulativeAmount}`
      );
    }
    return { selectedOutputs, selectedAmount: cumulativeAmount };
  }
};

// src/wallet/adapters/persistence/local-storage-persistence.ts
var LocalStoragePersistenceAdapter = class {
  constructor(storageKey = "webdeeds-wallet") {
    this.storageKey = storageKey;
  }
  getLocalStorage() {
    if (typeof localStorage === "undefined") {
      throw new Error("LocalStorage is not available in this environment");
    }
    return localStorage;
  }
  getOutputs() {
    return __async(this, null, function* () {
      const storage = this.getLocalStorage();
      const outputsJson = storage.getItem(this.storageKey);
      if (!outputsJson) {
        return [];
      }
      try {
        const outputStrings = JSON.parse(outputsJson);
        return outputStrings.map((str) => Output.fromString(str));
      } catch (error) {
        console.error("Error parsing wallet data:", error);
        return [];
      }
    });
  }
  saveOutputs(outputs) {
    return __async(this, null, function* () {
      const storage = this.getLocalStorage();
      const outputStrings = outputs.map((output) => output.toString());
      storage.setItem(this.storageKey, JSON.stringify(outputStrings));
    });
  }
  addOutputs(outputs) {
    return __async(this, null, function* () {
      const existingOutputs = yield this.getOutputs();
      const allOutputs = [...existingOutputs, ...outputs];
      yield this.saveOutputs(allOutputs);
    });
  }
  removeOutputs(outputsToRemove) {
    return __async(this, null, function* () {
      const existingOutputs = yield this.getOutputs();
      const outputStringsToRemove = outputsToRemove.map(
        (output) => output.toString()
      );
      const filteredOutputs = existingOutputs.filter(
        (output) => !outputStringsToRemove.includes(output.toString())
      );
      yield this.saveOutputs(filteredOutputs);
    });
  }
  clear() {
    return __async(this, null, function* () {
      const storage = this.getLocalStorage();
      storage.removeItem(this.storageKey);
    });
  }
};
export {
  DEFAULT_CONFIG,
  LocalStoragePersistenceAdapter,
  MemoryPersistenceAdapter,
  Output,
  Secret,
  Wallet,
  WebdeedsApiAdapter,
  WebdeedsClient
};
//# sourceMappingURL=index.browser.mjs.map