import { WebdeedsClient } from "../../../index";
import { WebdeedsApiClient } from "./webdeeds-api-client.interface";

/**
 * Adapter for the Webdeeds API client
 */
export class WebdeedsApiAdapter implements WebdeedsApiClient {
  private client: WebdeedsClient;

  constructor(client: WebdeedsClient) {
    this.client = client;
  }

  /**
   * Execute a swap operation
   * @param inputs Input deeds with secrets
   * @param outputs Output deeds with new secrets
   * @returns True if the swap was successful
   */
  async swap(inputs: string[], outputs: string[]): Promise<boolean> {
    const response = await this.client.swap.create({
      inputs,
      outputs,
    });

    return response.success;
  }
}
