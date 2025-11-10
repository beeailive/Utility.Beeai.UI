import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Application,
  ListApplicationsRequest,
  ListApplicationsResponse,
  CreateApplicationRequest,
  CreateApplicationResponse,
  GetApplicationResponse,
  UpdateApplicationRequest
} from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl || 'http://136.112.165.113:8090/api';

  listApplications(request: ListApplicationsRequest): Observable<ListApplicationsResponse> {
    let params = new HttpParams();
    if (request.limit) params = params.set('limit', request.limit.toString());
    if (request.offset) params = params.set('offset', request.offset.toString());
    if (request.search) params = params.set('search', request.search);
    if (request.tenantId) params = params.set('tenantId', request.tenantId);

    return this.http.get<ListApplicationsResponse>(`${this.apiUrl}/applications`, { params });
  }

  getApplication(id: string): Observable<GetApplicationResponse> {
    return this.http.get<GetApplicationResponse>(`${this.apiUrl}/applications/${id}`);
  }

  createApplication(request: CreateApplicationRequest): Observable<CreateApplicationResponse> {
    return this.http.post<CreateApplicationResponse>(`${this.apiUrl}/applications`, request);
  }

  updateApplication(id: string, request: UpdateApplicationRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/applications/${id}`, request);
  }

  deleteApplication(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/applications/${id}`);
  }
}

