import { PersistenceAdapter } from "./persistence-adapter.interface";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Output } from "../../core/output";

/**
 * File-based implementation of the persistence adapter
 */
export class FilePersistenceAdapter implements PersistenceAdapter {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  private async ensureDirectoryExists(): Promise<void> {
    const dir = path.dirname(this.filePath);
    try {
      await fs.access(dir);
    } catch (error) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  async getOutputs(): Promise<Output[]> {
    try {
      await this.ensureDirectoryExists();
      const fileContent = await fs.readFile(this.filePath, "utf-8");
      const lines = fileContent
        .split("\n")
        .filter((line: string) => line.trim().length > 0);
      return lines.map((line: string) => Output.fromString(line));
    } catch (error) {
      if ((error as { code?: string }).code === "ENOENT") {
        // File doesn't exist yet, return empty array
        return [];
      }
      throw error;
    }
  }

  async saveOutputs(outputs: Output[]): Promise<void> {
    await this.ensureDirectoryExists();
    const outputStrings = outputs.map((output) => output.toString());
    await fs.writeFile(this.filePath, outputStrings.join("\n"));
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
    try {
      await fs.unlink(this.filePath);
    } catch (error) {
      if ((error as { code?: string }).code !== "ENOENT") {
        throw error;
      }
      // File doesn't exist, nothing to do
    }
  }
}
