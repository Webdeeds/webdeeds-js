import { Output } from "../../core/output";
import { PersistenceAdapter } from "./persistence-adapter.interface";

/**
 * In-memory implementation of the persistence adapter
 */
export class MemoryPersistenceAdapter implements PersistenceAdapter {
  private outputs: Output[] = [];

  constructor(initialOutputs: Output[] = []) {
    this.outputs = [...initialOutputs];
  }

  async getOutputs(): Promise<Output[]> {
    return [...this.outputs];
  }

  async saveOutputs(outputs: Output[]): Promise<void> {
    this.outputs = [...outputs];
  }

  async addOutputs(outputs: Output[]): Promise<void> {
    this.outputs = [...this.outputs, ...outputs];
  }

  async removeOutputs(outputsToRemove: Output[]): Promise<void> {
    const outputStrings = outputsToRemove.map((output) => output.toString());
    this.outputs = this.outputs.filter(
      (output) => !outputStrings.includes(output.toString())
    );
  }

  async clear(): Promise<void> {
    this.outputs = [];
  }
}
