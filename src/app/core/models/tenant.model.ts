export interface Tenant {
  id: string;
  name: string;
  description?: string;
  canHaveGateways: boolean;
  maxGatewayCount?: number;
  maxDeviceCount?: number;
  privateGatewaysUp?: boolean;
  privateGatewaysDown?: boolean;
  tags?: { [key: string]: string };
}

export interface TenantListItem {
  id: string;
  name: string;
  canHaveGateways: boolean;
  privateGatewaysUp: boolean;
  privateGatewaysDown: boolean;
  maxGatewayCount: number;
  maxDeviceCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListTenantsRequest {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface ListTenantsResponse {
  totalCount: number;
  result: TenantListItem[];
}

export interface CreateTenantRequest {
  tenant: Tenant;
}

export interface CreateTenantResponse {
  id: string;
}

export interface GetTenantRequest {
  id: string;
}

export interface GetTenantResponse {
  tenant: Tenant;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTenantRequest {
  tenant: Tenant;
}

export interface DeleteTenantRequest {
  id: string;
}

// Tenant User Management
export interface TenantUser {
  tenantId: string;
  userId: string;
  email: string;
  isAdmin: boolean;
  isDeviceAdmin: boolean;
  isGatewayAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListTenantUsersResponse {
  totalCount: number;
  result: TenantUser[];
}

export interface GetTenantUserResponse {
  tenantUser: {
    tenantId: string;
    userId: string;
    isAdmin: boolean;
    isDeviceAdmin: boolean;
    isGatewayAdmin: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AddTenantUserRequest {
  tenantUser: {
    tenantId: string;
    userId: string;
    isAdmin: boolean;
    isDeviceAdmin: boolean;
    isGatewayAdmin: boolean;
  };
}

export interface UpdateTenantUserRequest {
  tenantUser: {
    tenantId: string;
    userId: string;
    isAdmin: boolean;
    isDeviceAdmin: boolean;
    isGatewayAdmin: boolean;
  };
}

