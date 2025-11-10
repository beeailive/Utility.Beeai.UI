import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Device,
  ListDevicesRequest,
  ListDevicesResponse,
  CreateDeviceRequest,
  GetDeviceResponse,
  UpdateDeviceRequest,
  GetDeviceActivationResponse,
  ActivateDeviceRequest,
  GetDeviceKeysResponse,
  CreateDeviceKeysRequest,
  UpdateDeviceKeysRequest,
  GetDeviceMetricsResponse,
  GetDeviceLinkMetricsRequest,
  GetDeviceLinkMetricsResponse,
  GetDeviceQueueResponse,
  EnqueueDeviceQueueItemRequest,
  EnqueueDeviceQueueItemResponse,
  GetRandomDevAddrResponse,
  GetNextFCntDownResponse,
  ListDeviceEventsRequest,
  ListDeviceEventsResponse,
  ListLoRaWANFramesRequest,
  ListLoRaWANFramesResponse
} from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl || 'http://136.112.165.113:8090/api';

  // Device CRUD operations
  listDevices(request: ListDevicesRequest = {}): Observable<ListDevicesResponse> {
    let params = new HttpParams();
    if (request.limit) params = params.set('limit', request.limit.toString());
    if (request.offset) params = params.set('offset', request.offset.toString());
    if (request.search) params = params.set('search', request.search);
    if (request.applicationId) params = params.set('applicationId', request.applicationId);

    return this.http.get<ListDevicesResponse>(`${this.apiUrl}/devices`, { params });
  }

  getDevice(devEui: string): Observable<GetDeviceResponse> {
    return this.http.get<GetDeviceResponse>(`${this.apiUrl}/devices/${devEui}`);
  }

  createDevice(request: CreateDeviceRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/devices`, request);
  }

  updateDevice(devEui: string, request: UpdateDeviceRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/devices/${devEui}`, request);
  }

  deleteDevice(devEui: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/devices/${devEui}`);
  }

  // Device Activation
  getDeviceActivation(devEui: string): Observable<GetDeviceActivationResponse> {
    return this.http.get<GetDeviceActivationResponse>(`${this.apiUrl}/devices/${devEui}/activation`);
  }

  activateDevice(devEui: string, request: ActivateDeviceRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/devices/${devEui}/activation`, request);
  }

  deactivateDevice(devEui: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/devices/${devEui}/activation`);
  }

  // Device Keys
  getDeviceKeys(devEui: string): Observable<GetDeviceKeysResponse> {
    return this.http.get<GetDeviceKeysResponse>(`${this.apiUrl}/devices/${devEui}/keys`);
  }

  createDeviceKeys(devEui: string, request: CreateDeviceKeysRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/devices/${devEui}/keys`, request);
  }

  updateDeviceKeys(devEui: string, request: UpdateDeviceKeysRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/devices/${devEui}/keys`, request);
  }

  deleteDeviceKeys(devEui: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/devices/${devEui}/keys`);
  }

  // Device Metrics
  getDeviceMetrics(request: GetDeviceLinkMetricsRequest): Observable<GetDeviceMetricsResponse> {
    let params = new HttpParams();
    if (request.start) params = params.set('start', request.start);
    if (request.end) params = params.set('end', request.end);
    if (request.aggregation) params = params.set('aggregation', request.aggregation);

    return this.http.get<GetDeviceMetricsResponse>(`${this.apiUrl}/devices/${request.devEui}/metrics`, { params });
  }

  getDeviceLinkMetrics(request: GetDeviceLinkMetricsRequest): Observable<GetDeviceLinkMetricsResponse> {
    let params = new HttpParams();
    if (request.start) params = params.set('start', request.start);
    if (request.end) params = params.set('end', request.end);
    if (request.aggregation) params = params.set('aggregation', request.aggregation);

    return this.http.get<GetDeviceLinkMetricsResponse>(`${this.apiUrl}/devices/${request.devEui}/link-metrics`, { params });
  }

  // Device Queue
  getDeviceQueue(devEui: string): Observable<GetDeviceQueueResponse> {
    return this.http.get<GetDeviceQueueResponse>(`${this.apiUrl}/devices/${devEui}/queue`);
  }

  enqueueDeviceQueueItem(devEui: string, request: EnqueueDeviceQueueItemRequest): Observable<EnqueueDeviceQueueItemResponse> {
    return this.http.post<EnqueueDeviceQueueItemResponse>(`${this.apiUrl}/devices/${devEui}/queue`, request);
  }

  flushDeviceQueue(devEui: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/devices/${devEui}/queue`);
  }

  // Utility methods
  getRandomDevAddr(devEui: string): Observable<GetRandomDevAddrResponse> {
    return this.http.post<GetRandomDevAddrResponse>(`${this.apiUrl}/devices/${devEui}/get-random-dev-addr`, {});
  }

  getNextFCntDown(devEui: string): Observable<GetNextFCntDownResponse> {
    return this.http.post<GetNextFCntDownResponse>(`${this.apiUrl}/devices/${devEui}/get-next-f-cnt-down`, {});
  }

  // Flush device nonces
  flushDevNonces(devEui: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/devices/${devEui}/dev-nonces`);
  }

  // Device Events
  listDeviceEvents(request: ListDeviceEventsRequest): Observable<ListDeviceEventsResponse> {
    let params = new HttpParams();
    if (request.limit) params = params.set('limit', request.limit.toString());
    if (request.offset) params = params.set('offset', request.offset.toString());

    return this.http.get<ListDeviceEventsResponse>(`${this.apiUrl}/devices/${request.devEui}/events`, { params });
  }

  // LoRaWAN Frames
  listLoRaWANFrames(request: ListLoRaWANFramesRequest): Observable<ListLoRaWANFramesResponse> {
    let params = new HttpParams();
    if (request.limit) params = params.set('limit', request.limit.toString());
    if (request.offset) params = params.set('offset', request.offset.toString());

    return this.http.get<ListLoRaWANFramesResponse>(`${this.apiUrl}/devices/${request.devEui}/frames`, { params });
  }
}

