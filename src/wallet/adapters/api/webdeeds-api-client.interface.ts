/**
 * Interface for the Webdeeds API client
 */
export interface WebdeedsApiClient {
  /**
   * Execute a swap operation
   * @param inputs Input deeds with secrets
   * @param outputs Output deeds with new secrets
   * @returns True if the swap was successful
   */
  swap(inputs: string[], outputs: string[]): Promise<boolean>;
}
