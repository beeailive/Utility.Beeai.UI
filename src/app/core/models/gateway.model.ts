export interface Gateway {
  gatewayId: string;
  name: string;
  description?: string;
  location?: Location;
  tenantId: string;
  tags?: { [key: string]: string };
  metadata?: { [key: string]: string };
  statsInterval?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  altitude: number;
  source: string;
  accuracy: number;
}

export interface GatewayListItem {
  gatewayId: string;
  name: string;
  description: string;
  location?: Location;
  tenantId: string;
  tenantName: string;
  createdAt: string;
  updatedAt: string;
  lastSeenAt?: string;
  state?: string;
}

export interface ListGatewaysRequest {
  tenantId?: string;
  limit?: number;
  offset?: number;
  search?: string;
}

export interface ListGatewaysResponse {
  totalCount: number;
  result: GatewayListItem[];
}

export interface CreateGatewayRequest {
  gateway: Gateway;
}

export interface GetGatewayRequest {
  gatewayId: string;
}

export interface GetGatewayResponse {
  gateway: Gateway;
  createdAt: string;
  updatedAt: string;
  lastSeenAt?: string;
}

export interface UpdateGatewayRequest {
  gateway: Gateway;
}

export interface DeleteGatewayRequest {
  gatewayId: string;
}

export interface GatewayStats {
  gatewayId: string;
  time: string;
  rxPacketsReceived: number;
  rxPacketsReceivedOk: number;
  txPacketsReceived: number;
  txPacketsEmitted: number;
}

// Relay Gateway interfaces
export interface RelayGateway {
  tenantId: string;
  relayId: string;
  name: string;
  description?: string;
  statsInterval?: number;
  regionConfigId?: string;
}

export interface RelayGatewayListItem {
  tenantId: string;
  relayId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  lastSeenAt?: string;
}

export interface ListRelayGatewaysRequest {
  tenantId: string;
  limit?: number;
  offset?: number;
}

export interface ListRelayGatewaysResponse {
  totalCount: number;
  result: RelayGatewayListItem[];
}

export interface GetRelayGatewayResponse {
  relayGateway: RelayGateway;
  createdAt: string;
  updatedAt: string;
  lastSeenAt?: string;
}

export interface CreateRelayGatewayRequest {
  relayGateway: RelayGateway;
}

export interface UpdateRelayGatewayRequest {
  relayGateway: RelayGateway;
}

// Gateway Metrics interfaces
export interface GatewayMetrics {
  rxPacketsReceived: number;
  rxPacketsReceivedOk: number;
  txPacketsReceived: number;
  txPacketsEmitted: number;
}

export interface GetGatewayMetricsResponse {
  metrics: GatewayMetrics;
}

// Duty Cycle Metrics interfaces
export interface DutyCycleMetric {
  time: string;
  maxLoadPercentage: number;
  windowPercentage: number;
}

export interface GetDutyCycleMetricsRequest {
  gatewayId: string;
  start: string;
  end: string;
  aggregation?: string;
}

export interface GetDutyCycleMetricsResponse {
  result: DutyCycleMetric[];
}

// Generate Certificate interfaces
export interface GenerateCertificateResponse {
  tlsCert: string;
  tlsKey: string;
  caCert: string;
  expiresAt: string;
}

