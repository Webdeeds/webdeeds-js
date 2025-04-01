import { ApiClient } from "./client";
import { WebdeedsConfig } from "./config";
import { MintService } from "./services/mint";
import { SwapService } from "./services/swap";
import { RegistryService } from "./services/registry";

export * from "./types";
export * from "./config";

export class WebdeedsClient {
  private client: ApiClient;
  public mint: MintService;
  public swap: SwapService;
  public registry: RegistryService;

  constructor(config: Partial<WebdeedsConfig> = {}) {
    this.client = new ApiClient(config);
    this.mint = new MintService(this.client);
    this.swap = new SwapService(this.client);
    this.registry = new RegistryService(this.client);
  }
}

export default WebdeedsClient;
