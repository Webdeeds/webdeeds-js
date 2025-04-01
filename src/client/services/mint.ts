import { ApiClient } from "../client";
import { MintRequest, MintResponse } from "../types";

export class MintService {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Create a new mint request
   * @param request The mint request data
   * @returns A promise that resolves to the mint response
   */
  async create(request: MintRequest): Promise<MintResponse> {
    return this.client.post<MintResponse>("/v1/mint", request);
  }
}
