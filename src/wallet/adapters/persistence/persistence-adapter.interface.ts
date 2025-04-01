import { Output } from "../../core/output";

/**
 * Interface for wallet persistence adapters
 */
export interface PersistenceAdapter {
  /**
   * Get all outputs stored in the wallet
   */
  getOutputs(): Promise<Output[]>;

  /**
   * Save outputs to the wallet
   * @param outputs The outputs to save
   */
  saveOutputs(outputs: Output[]): Promise<void>;

  /**
   * Add outputs to the wallet
   * @param outputs The outputs to add
   */
  addOutputs(outputs: Output[]): Promise<void>;

  /**
   * Remove outputs from the wallet
   * @param outputs The outputs to remove
   */
  removeOutputs(outputs: Output[]): Promise<void>;

  /**
   * Clear all outputs from the wallet
   */
  clear(): Promise<void>;
}
