/**
 * Secret class for managing deed secrets
 * In a production environment, this should be replaced with a secure
 * cryptographic implementation
 */
import randomBytes from "randombytes";

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
    return randomBytes(16).toString("hex");
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
