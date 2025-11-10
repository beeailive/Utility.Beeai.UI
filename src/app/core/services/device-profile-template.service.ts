import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ListDeviceProfileTemplatesRequest,
  ListDeviceProfileTemplatesResponse,
  CreateDeviceProfileTemplateRequest,
  CreateDeviceProfileTemplateResponse,
  GetDeviceProfileTemplateRequest,
  GetDeviceProfileTemplateResponse,
  UpdateDeviceProfileTemplateRequest,
  DeleteDeviceProfileTemplateRequest
} from '../models/device-profile-template.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceProfileTemplateService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl || 'http://136.112.165.113:8090/api';

  /**
   * List device profile templates
   */
  listDeviceProfileTemplates(request: ListDeviceProfileTemplatesRequest = {}): Observable<ListDeviceProfileTemplatesResponse> {
    let params = new HttpParams();
    if (request.limit) {
      params = params.set('limit', request.limit.toString());
    }
    if (request.offset) {
      params = params.set('offset', request.offset.toString());
    }

    return this.http.get<ListDeviceProfileTemplatesResponse>(`${this.apiUrl}/device-profile-templates`, { params });
  }

  /**
   * Create a new device profile template
   */
  createDeviceProfileTemplate(request: CreateDeviceProfileTemplateRequest): Observable<CreateDeviceProfileTemplateResponse> {
    return this.http.post<CreateDeviceProfileTemplateResponse>(`${this.apiUrl}/device-profile-templates`, request);
  }

  /**
   * Get a device profile template by ID
   */
  getDeviceProfileTemplate(request: GetDeviceProfileTemplateRequest): Observable<GetDeviceProfileTemplateResponse> {
    return this.http.get<GetDeviceProfileTemplateResponse>(`${this.apiUrl}/device-profile-templates/${request.id}`);
  }

  /**
   * Update a device profile template
   */
  updateDeviceProfileTemplate(id: string, request: UpdateDeviceProfileTemplateRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/device-profile-templates/${id}`, request);
  }

  /**
   * Delete a device profile template
   */
  deleteDeviceProfileTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/device-profile-templates/${id}`);
  }
}

