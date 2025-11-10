import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Gateway,
  ListGatewaysRequest,
  ListGatewaysResponse,
  CreateGatewayRequest,
  GetGatewayResponse,
  UpdateGatewayRequest,
  GatewayStats,
  ListRelayGatewaysRequest,
  ListRelayGatewaysResponse,
  GetRelayGatewayResponse,
  CreateRelayGatewayRequest,
  UpdateRelayGatewayRequest,
  GetGatewayMetricsResponse,
  GetDutyCycleMetricsRequest,
  GetDutyCycleMetricsResponse,
  GenerateCertificateResponse
} from '../models/gateway.model';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl || 'http://136.112.165.113:8090/api';

  listGateways(request: ListGatewaysRequest = {}): Observable<ListGatewaysResponse> {
    let params = new HttpParams();
    if (request.limit) params = params.set('limit', request.limit.toString());
    if (request.offset) params = params.set('offset', request.offset.toString());
    if (request.search) params = params.set('search', request.search);
    if (request.tenantId) params = params.set('tenantId', request.tenantId);

    return this.http.get<ListGatewaysResponse>(`${this.apiUrl}/gateways`, { params });
  }

  getGateway(gatewayId: string): Observable<GetGatewayResponse> {
    return this.http.get<GetGatewayResponse>(`${this.apiUrl}/gateways/${gatewayId}`);
  }

  createGateway(request: CreateGatewayRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/gateways`, request);
  }

  updateGateway(gatewayId: string, request: UpdateGatewayRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/gateways/${gatewayId}`, request);
  }

  deleteGateway(gatewayId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/gateways/${gatewayId}`);
  }

  getGatewayStats(gatewayId: string, start: string, end: string, aggregation: string = 'HOUR'): Observable<any> {
    let params = new HttpParams()
      .set('start', start)
      .set('end', end)
      .set('aggregation', aggregation);

    // Try metrics endpoint instead of stats (ChirpStack might use different endpoint)
    return this.http.get<any>(`${this.apiUrl}/gateways/${gatewayId}/metrics`, { params });
  }

  // Relay Gateway methods
  listRelayGateways(request: ListRelayGatewaysRequest): Observable<ListRelayGatewaysResponse> {
    let params = new HttpParams();
    if (request.limit) params = params.set('limit', request.limit.toString());
    if (request.offset) params = params.set('offset', request.offset.toString());
    if (request.tenantId) params = params.set('tenantId', request.tenantId);

    return this.http.get<ListRelayGatewaysResponse>(`${this.apiUrl}/gateways/relay-gateways`, { params });
  }

  getRelayGateway(tenantId: string, relayId: string): Observable<GetRelayGatewayResponse> {
    return this.http.get<GetRelayGatewayResponse>(
      `${this.apiUrl}/gateways/relay-gateways/${tenantId}/${relayId}`
    );
  }

  createRelayGateway(tenantId: string, relayId: string, request: CreateRelayGatewayRequest): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/gateways/relay-gateways/${tenantId}/${relayId}`,
      request
    );
  }

  updateRelayGateway(tenantId: string, relayId: string, request: UpdateRelayGatewayRequest): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/gateways/relay-gateways/${tenantId}/${relayId}`,
      request
    );
  }

  deleteRelayGateway(tenantId: string, relayId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/gateways/relay-gateways/${tenantId}/${relayId}`
    );
  }

  // Gateway Metrics
  getGatewayMetrics(gatewayId: string): Observable<GetGatewayMetricsResponse> {
    return this.http.get<GetGatewayMetricsResponse>(`${this.apiUrl}/gateways/${gatewayId}/metrics`);
  }

  // Duty Cycle Metrics
  getDutyCycleMetrics(request: GetDutyCycleMetricsRequest): Observable<GetDutyCycleMetricsResponse> {
    let params = new HttpParams()
      .set('start', request.start)
      .set('end', request.end);

    if (request.aggregation) {
      params = params.set('aggregation', request.aggregation);
    }

    return this.http.get<GetDutyCycleMetricsResponse>(
      `${this.apiUrl}/gateways/${request.gatewayId}/duty-cycle-metrics`,
      { params }
    );
  }

  // Generate Certificate
  generateCertificate(gatewayId: string): Observable<GenerateCertificateResponse> {
    return this.http.post<GenerateCertificateResponse>(
      `${this.apiUrl}/gateways/${gatewayId}/generate-certificate`,
      {}
    );
  }
}

