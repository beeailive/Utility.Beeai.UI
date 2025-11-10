export interface User {
  id: string;
  email: string;
  note?: string;
  isAdmin: boolean;
  isActive: boolean;
}

export interface UserListItem {
  id: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListUsersRequest {
  limit?: number;
  offset?: number;
}

export interface ListUsersResponse {
  totalCount: number;
  result: UserListItem[];
}

export interface CreateUserRequest {
  user: User;
  password: string;
  tenants?: UserTenant[];
}

export interface CreateUserResponse {
  id: string;
}

export interface GetUserRequest {
  id: string;
}

export interface GetUserResponse {
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  user: User;
}

export interface DeleteUserRequest {
  id: string;
}

export interface UserTenant {
  tenantId: string;
  isAdmin: boolean;
  isDeviceAdmin: boolean;
  isGatewayAdmin: boolean;
}

export interface UpdateUserPasswordRequest {
  userId: string;
  password: string;
}

