import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ListApiKeysRequest,
  ListApiKeysResponse,
  CreateApiKeyRequest,
  CreateApiKeyResponse
} from '../models/api-key.model';

@Injectable({
  providedIn: 'root'
})
export class ApiKeyService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl || 'http://136.112.165.113:8090/api';

  listApiKeys(request: ListApiKeysRequest = {}): Observable<ListApiKeysResponse> {
    let params = new HttpParams();
    if (request.limit) params = params.set('limit', request.limit.toString());
    if (request.offset) params = params.set('offset', request.offset.toString());
    if (request.isAdmin !== undefined) params = params.set('isAdmin', request.isAdmin.toString());
    if (request.tenantId) params = params.set('tenantId', request.tenantId);

    return this.http.get<ListApiKeysResponse>(`${this.apiUrl}/internal/api-keys`, { params });
  }

  createApiKey(request: CreateApiKeyRequest): Observable<CreateApiKeyResponse> {
    return this.http.post<CreateApiKeyResponse>(`${this.apiUrl}/internal/api-keys`, request);
  }

  deleteApiKey(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/internal/api-keys/${id}`);
  }
}

