export interface ApiKey {
  id: string;
  name: string;
  isAdmin: boolean;
  tenantId?: string;
}

export interface ApiKeyListItem {
  id: string;
  name: string;
  isAdmin: boolean;
  tenantId: string;
  createdAt: string;
}

export interface ListApiKeysRequest {
  limit?: number;
  offset?: number;
  isAdmin?: boolean;
  tenantId?: string;
}

export interface ListApiKeysResponse {
  totalCount: number;
  result: ApiKeyListItem[];
}

export interface CreateApiKeyRequest {
  apiKey: ApiKey;
}

export interface CreateApiKeyResponse {
  id: string;
  token: string;
}

export interface DeleteApiKeyRequest {
  id: string;
}

