import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ListRegionsRequest,
  ListRegionsResponse,
  GetRegionResponse,
  CreateRegionRequest,
  UpdateRegionRequest
} from '../models/region.model';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl || 'http://136.112.165.113:8090/api';

  listRegions(request: ListRegionsRequest = {}): Observable<ListRegionsResponse> {
    let params = new HttpParams();
    if (request.limit) params = params.set('limit', request.limit.toString());
    if (request.offset) params = params.set('offset', request.offset.toString());

    return this.http.get<ListRegionsResponse>(`${this.apiUrl}/regions`, { params });
  }

  getRegion(id: string): Observable<GetRegionResponse> {
    return this.http.get<GetRegionResponse>(`${this.apiUrl}/regions/${id}`);
  }

  createRegion(request: CreateRegionRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/regions`, request);
  }

  updateRegion(id: string, request: UpdateRegionRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/regions/${id}`, request);
  }

  deleteRegion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/regions/${id}`);
  }
}

