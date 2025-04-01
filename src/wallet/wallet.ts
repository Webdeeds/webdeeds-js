import { Output } from "./core/output";
import { Secret } from "./core/secret";
import { PersistenceAdapter } from "./adapters/persistence/persistence-adapter.interface";
import { WebdeedsApiClient } from "./adapters/api/webdeeds-api-client.interface";
import { MemoryPersistenceAdapter } from "./adapters/persistence/memory-persistence";
import { WebdeedsApiAdapter } from "./adapters/api/webdeeds-api-adapter";
import WebdeedsClient from "../client";

/**
 * Interface for grouped wallet items
 */
export interface WalletItem {
  itemId: string;
  totalAmount: number;
}

/**
 * Main wallet class for managing Webdeeds
 */
export class Wallet {
  private persistence: PersistenceAdapter;
  private apiClient: WebdeedsApiClient;

  constructor(
    persistence: PersistenceAdapter = new MemoryPersistenceAdapter(),
    apiClient: WebdeedsApiClient = new WebdeedsApiAdapter(new WebdeedsClient())
  ) {
    this.persistence = persistence;
    this.apiClient = apiClient;
  }

  /**
   * List all items in the wallet, grouped by item ID
   * @returns A list of wallet items with their total amounts
   */
  async list(): Promise<WalletItem[]> {
    const outputs = await this.persistence.getOutputs();

    // Group outputs by itemId
    const outputsByItemId: Record<string, Output[]> = {};

    for (const output of outputs) {
      const itemId = output.getItemId();

      if (!outputsByItemId[itemId]) {
        outputsByItemId[itemId] = [];
      }

      outputsByItemId[itemId].push(output);
    }

    // Convert to WalletItem array
    const result: WalletItem[] = [];

    for (const itemId in outputsByItemId) {
      if (Object.prototype.hasOwnProperty.call(outputsByItemId, itemId)) {
        const itemOutputs = outputsByItemId[itemId];
        const totalAmount = itemOutputs.reduce(
          (sum: number, output: Output) => sum + output.getAmount(),
          0
        );

        result.push({
          itemId,
          totalAmount,
        });
      }
    }

    return result;
  }

  /**
   * Send a specific amount of an item
   * @param itemId The ID of the item to send
   * @param amount The amount to send
   * @returns The output that is ready to be sent to the recipient
   */
  async send(itemId: string, amount: number): Promise<string> {
    if (amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }

    const walletOutputs = await this.persistence.getOutputs();
    const itemOutputs = walletOutputs.filter(
      (output) => output.getItemId() === itemId
    );

    // Calculate total amount available for this item
    const totalAvailable = itemOutputs.reduce(
      (sum, output) => sum + output.getAmount(),
      0
    );

    if (totalAvailable < amount) {
      throw new Error(
        `Insufficient amount available. Requested: ${amount}, Available: ${totalAvailable}`
      );
    }

    // Select outputs to use for the transaction
    const { selectedOutputs, selectedAmount } = this.selectOutputs(
      itemOutputs,
      amount
    );

    // Create a new secret for the output to send
    const outputSecret = new Secret();

    // If we have change, create a new secret for it
    const changeSecret = new Secret();

    // Prepare inputs and outputs for the swap
    const inputs = selectedOutputs.map((output) => output.toString());
    const swapOutputs: string[] = [];

    // Add the output to send
    swapOutputs.push(`+${amount}.${itemId}.${outputSecret.toString()}`);

    // Add change output if needed
    if (selectedAmount > amount) {
      const changeAmount = selectedAmount - amount;
      swapOutputs.push(`+${changeAmount}.${itemId}.${changeSecret.toString()}`);
    }

    // Execute the swap
    const success = await this.apiClient.swap(inputs, swapOutputs);

    if (!success) {
      throw new Error("Swap operation failed");
    }

    // Remove the spent outputs from the wallet
    await this.persistence.removeOutputs(selectedOutputs);

    // If we have change, add it back to the wallet
    if (selectedAmount > amount) {
      const changeAmount = selectedAmount - amount;
      const changeOutput = new Output(changeAmount, itemId, changeSecret);
      await this.persistence.addOutputs([changeOutput]);
    }

    // Return the output string that can be sent to recipient
    return `+${amount}.${itemId}.${outputSecret.toString()}`;
  }

  /**
   * Receive outputs and secure them by updating the secrets
   * @param outputStrings Array of output strings to receive
   * @returns True if all outputs were successfully received
   */
  async receive(outputStrings: string[]): Promise<boolean> {
    if (!outputStrings.length) {
      return true;
    }

    // Process each output
    for (const outputString of outputStrings) {
      const output = Output.fromString(outputString);

      // Create a new output with a new secret
      const newSecret = new Secret();
      const newOutput = output.withNewSecret(newSecret);

      // Execute the swap to secure custody
      const success = await this.apiClient.swap(
        [outputString],
        [newOutput.toString()]
      );

      if (!success) {
        throw new Error(`Failed to receive output: ${outputString}`);
      }

      // Add the new output to the wallet
      await this.persistence.addOutputs([newOutput]);
    }

    return true;
  }

  /**
   * Helper method to select outputs that sum to at least the required amount
   * @param outputs Available outputs
   * @param requiredAmount The amount needed
   * @returns Selected outputs and their total amount
   */
  private selectOutputs(
    outputs: Output[],
    requiredAmount: number
  ): {
    selectedOutputs: Output[];
    selectedAmount: number;
  } {
    // Sort outputs by amount (ascending)
    const sortedOutputs = [...outputs].sort(
      (a, b) => a.getAmount() - b.getAmount()
    );

    let cumulativeAmount = 0;
    const selectedOutputs: Output[] = [];

    // Try to find a single output with the exact amount
    const exactOutput = sortedOutputs.find(
      (output) => output.getAmount() === requiredAmount
    );
    if (exactOutput) {
      return {
        selectedOutputs: [exactOutput],
        selectedAmount: exactOutput.getAmount(),
      };
    }

    // Otherwise, find the smallest output larger than the required amount
    const largerOutput = sortedOutputs.find(
      (output) => output.getAmount() > requiredAmount
    );
    if (largerOutput) {
      return {
        selectedOutputs: [largerOutput],
        selectedAmount: largerOutput.getAmount(),
      };
    }

    // If no single output is sufficient, we need to combine multiple outputs
    // Start with the largest outputs to minimize the number of inputs
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
}
