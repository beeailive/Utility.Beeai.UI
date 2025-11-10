import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DeviceProfile,
  ListDeviceProfilesRequest,
  ListDeviceProfilesResponse,
  CreateDeviceProfileRequest,
  CreateDeviceProfileResponse,
  GetDeviceProfileResponse,
  UpdateDeviceProfileRequest,
  ListAdrAlgorithmsResponse
} from '../models/device-profile.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceProfileService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl || 'http://136.112.165.113:8090/api';

  listDeviceProfiles(request: ListDeviceProfilesRequest): Observable<ListDeviceProfilesResponse> {
    let params = new HttpParams();
    if (request.limit) params = params.set('limit', request.limit.toString());
    if (request.offset) params = params.set('offset', request.offset.toString());
    if (request.search) params = params.set('search', request.search);
    if (request.tenantId) params = params.set('tenantId', request.tenantId);

    return this.http.get<ListDeviceProfilesResponse>(`${this.apiUrl}/device-profiles`, { params });
  }

  getDeviceProfile(id: string): Observable<GetDeviceProfileResponse> {
    return this.http.get<GetDeviceProfileResponse>(`${this.apiUrl}/device-profiles/${id}`);
  }

  createDeviceProfile(request: CreateDeviceProfileRequest): Observable<CreateDeviceProfileResponse> {
    return this.http.post<CreateDeviceProfileResponse>(`${this.apiUrl}/device-profiles`, request);
  }

  updateDeviceProfile(id: string, request: UpdateDeviceProfileRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/device-profiles/${id}`, request);
  }

  deleteDeviceProfile(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/device-profiles/${id}`);
  }

  listAdrAlgorithms(): Observable<ListAdrAlgorithmsResponse> {
    return this.http.get<ListAdrAlgorithmsResponse>(`${this.apiUrl}/device-profiles/adr-algorithms`);
  }
}

