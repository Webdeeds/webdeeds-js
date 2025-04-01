import { Secret } from "./secret";

/**
 * Represents a deed output in the format +amount.itemId.secret
 */
export class Output {
  constructor(
    private amount: number,
    private itemId: string,
    private secret: Secret
  ) {}

  /**
   * Parse a deed output string into an Output object
   * @param outputString Format: +amount.itemId.secret
   */
  static fromString(outputString: string): Output {
    // Format: +amount.itemId.secret
    const matches = outputString.match(/^\+(\d+)\.([^.]+)\.(.+)$/);

    if (!matches) {
      throw new Error(`Invalid output format: ${outputString}`);
    }

    const [, amountStr, itemId, secretValue] = matches;
    const amount = parseInt(amountStr, 10);

    return new Output(amount, itemId, new Secret(secretValue));
  }

  /**
   * Convert the Output to its string representation
   */
  toString(): string {
    return `+${this.amount}.${this.itemId}.${this.secret.toString()}`;
  }

  getAmount(): number {
    return this.amount;
  }

  getItemId(): string {
    return this.itemId;
  }

  getSecret(): Secret {
    return this.secret;
  }

  /**
   * Create a new Output with the same amount and itemId but a new secret
   */
  withNewSecret(newSecret?: Secret): Output {
    return new Output(this.amount, this.itemId, newSecret || new Secret());
  }
}
