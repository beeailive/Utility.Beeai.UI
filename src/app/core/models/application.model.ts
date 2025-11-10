export interface Application {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  tags?: { [key: string]: string };
}

export interface ApplicationListItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListApplicationsRequest {
  tenantId: string;
  limit?: number;
  offset?: number;
  search?: string;
}

export interface ListApplicationsResponse {
  totalCount: number;
  result: ApplicationListItem[];
}

export interface CreateApplicationRequest {
  application: Application;
}

export interface CreateApplicationResponse {
  id: string;
}

export interface GetApplicationRequest {
  id: string;
}

export interface GetApplicationResponse {
  application: Application;
  createdAt: string;
  updatedAt: string;
  measurementKeys: string[];
}

export interface UpdateApplicationRequest {
  application: Application;
}

export interface DeleteApplicationRequest {
  id: string;
}

