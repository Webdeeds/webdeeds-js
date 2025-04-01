export interface Metadata {
  name?: string;
  description?: string;
  image?: string;
}

export interface MintRequest {
  metadata?: Metadata;
  outputs: string[];
}

export interface MintResponse {
  itemId: string;
  outputs: string[];
}

export interface SwapRequest {
  inputs: string[];
  outputs: string[];
}

export interface SwapResponse {
  success: boolean;
}

export interface RegistryItem {
  id: string;
  total: number;
  metadata?: Metadata;
}

export type ApiError = {
  status: number;
  message: string;
};
