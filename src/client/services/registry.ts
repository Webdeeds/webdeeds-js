import { ApiClient } from "../client";
import { RegistryItem } from "../types";

export class RegistryService {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Get registry item by ID
   * @param itemId The ID of the item to retrieve
   * @returns A promise that resolves to the registry item
   */
  async getItemById(itemId: string): Promise<RegistryItem> {
    return this.client.get<RegistryItem>(`/v1/item/${itemId}`);
  }
}
