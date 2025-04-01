import { Output } from "../../core/output";
import { PersistenceAdapter } from "./persistence-adapter.interface";

/**
 * LocalStorage implementation of the persistence adapter
 */
export class LocalStoragePersistenceAdapter implements PersistenceAdapter {
  private storageKey: string;

  constructor(storageKey: string = "webdeeds-wallet") {
    this.storageKey = storageKey;
  }

  private getLocalStorage(): Storage {
    if (typeof localStorage === "undefined") {
      throw new Error("LocalStorage is not available in this environment");
    }
    return localStorage;
  }

  async getOutputs(): Promise<Output[]> {
    const storage = this.getLocalStorage();
    const outputsJson = storage.getItem(this.storageKey);

    if (!outputsJson) {
      return [];
    }

    try {
      const outputStrings = JSON.parse(outputsJson) as string[];
      return outputStrings.map((str) => Output.fromString(str));
    } catch (error) {
      console.error("Error parsing wallet data:", error);
      return [];
    }
  }

  async saveOutputs(outputs: Output[]): Promise<void> {
    const storage = this.getLocalStorage();
    const outputStrings = outputs.map((output) => output.toString());
    storage.setItem(this.storageKey, JSON.stringify(outputStrings));
  }

  async addOutputs(outputs: Output[]): Promise<void> {
    const existingOutputs = await this.getOutputs();
    const allOutputs = [...existingOutputs, ...outputs];
    await this.saveOutputs(allOutputs);
  }

  async removeOutputs(outputsToRemove: Output[]): Promise<void> {
    const existingOutputs = await this.getOutputs();
    const outputStringsToRemove = outputsToRemove.map((output) =>
      output.toString()
    );

    const filteredOutputs = existingOutputs.filter(
      (output) => !outputStringsToRemove.includes(output.toString())
    );

    await this.saveOutputs(filteredOutputs);
  }

  async clear(): Promise<void> {
    const storage = this.getLocalStorage();
    storage.removeItem(this.storageKey);
  }
}
