import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Tenant,
  ListTenantsRequest,
  ListTenantsResponse,
  CreateTenantRequest,
  CreateTenantResponse,
  GetTenantResponse,
  UpdateTenantRequest,
  ListTenantUsersResponse,
  GetTenantUserResponse,
  AddTenantUserRequest,
  UpdateTenantUserRequest
} from '../models/tenant.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl || 'http://136.112.165.113:8090/api';

  listTenants(request: ListTenantsRequest = {}): Observable<ListTenantsResponse> {
    let params = new HttpParams();
    if (request.limit) params = params.set('limit', request.limit.toString());
    if (request.offset) params = params.set('offset', request.offset.toString());
    if (request.search) params = params.set('search', request.search);

    return this.http.get<ListTenantsResponse>(`${this.apiUrl}/tenants`, { params });
  }

  getTenant(id: string): Observable<GetTenantResponse> {
    return this.http.get<GetTenantResponse>(`${this.apiUrl}/tenants/${id}`);
  }

  createTenant(request: CreateTenantRequest): Observable<CreateTenantResponse> {
    return this.http.post<CreateTenantResponse>(`${this.apiUrl}/tenants`, request);
  }

  updateTenant(id: string, request: UpdateTenantRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/tenants/${id}`, request);
  }

  deleteTenant(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tenants/${id}`);
  }

  // Tenant User Management
  listTenantUsers(tenantId: string, limit?: number, offset?: number): Observable<ListTenantUsersResponse> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit.toString());
    if (offset) params = params.set('offset', offset.toString());

    return this.http.get<ListTenantUsersResponse>(`${this.apiUrl}/tenants/${tenantId}/users`, { params });
  }

  getTenantUser(tenantId: string, userId: string): Observable<GetTenantUserResponse> {
    return this.http.get<GetTenantUserResponse>(`${this.apiUrl}/tenants/${tenantId}/users/${userId}`);
  }

  addTenantUser(request: AddTenantUserRequest): Observable<void> {
    const tenantId = request.tenantUser.tenantId;
    return this.http.post<void>(`${this.apiUrl}/tenants/${tenantId}/users`, request);
  }

  updateTenantUser(request: UpdateTenantUserRequest): Observable<void> {
    const tenantId = request.tenantUser.tenantId;
    const userId = request.tenantUser.userId;
    return this.http.put<void>(`${this.apiUrl}/tenants/${tenantId}/users/${userId}`, request);
  }

  deleteTenantUser(tenantId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tenants/${tenantId}/users/${userId}`);
  }
}

