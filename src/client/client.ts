import { DEFAULT_CONFIG, WebdeedsConfig } from "./config";

export class ApiClient {
  private config: WebdeedsConfig;

  constructor(config: Partial<WebdeedsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    return headers;
  }

  public async request<T>(
    endpoint: string,
    method: string = "GET",
    body?: any
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;

    const options: RequestInit = {
      method,
      headers: this.getHeaders(),
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data as T;
  }

  public async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, "GET");
  }

  public async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, "POST", body);
  }
}
