/**
 * Secret class for managing deed secrets
 * In a production environment, this should be replaced with a secure
 * cryptographic implementation
 */

function getRandomBytes(size: number): Uint8Array {
  if (typeof window !== "undefined" && window.crypto) {
    // Browser environment
    return window.crypto.getRandomValues(new Uint8Array(size));
  } else if (typeof require !== "undefined") {
    // Node.js environment
    const crypto = require("crypto");
    return crypto.randomBytes(size);
  } else {
    throw new Error("No crypto implementation available");
  }
}

export class Secret {
  private value: string;

  constructor(value?: string) {
    this.value = value || Secret.generate();
  }

  /**
   * Generate a new random secret
   * Using cryptographically secure random bytes
   */
  static generate(): string {
    return Array.from(getRandomBytes(16))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
