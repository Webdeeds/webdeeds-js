import { ApiClient } from "../client";
import { SwapRequest, SwapResponse } from "../types";

export class SwapService {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Create a new swap request
   * @param request The swap request data
   * @returns A promise that resolves to the swap response
   */
  async create(request: SwapRequest): Promise<SwapResponse> {
    return this.client.post<SwapResponse>("/v1/swap", request);
  }
}
