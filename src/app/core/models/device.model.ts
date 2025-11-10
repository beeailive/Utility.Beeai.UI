export interface Device {
  devEui: string;
  name: string;
  description?: string;
  applicationId: string;
  deviceProfileId: string;
  skipFcntCheck: boolean;
  isDisabled: boolean;
  variables?: { [key: string]: string };
  tags?: { [key: string]: string };
  joinEui?: string;
}

export interface DeviceListItem {
  devEui: string;
  name: string;
  description: string;
  deviceProfileId: string;
  deviceProfileName: string;
  deviceStatus?: DeviceStatus;
  lastSeenAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceStatus {
  margin?: number;
  externalPowerSource?: boolean;
  batteryLevel?: number;
}

export interface ListDevicesRequest {
  applicationId?: string;
  limit?: number;
  offset?: number;
  search?: string;
}

export interface ListDevicesResponse {
  totalCount: number;
  result: DeviceListItem[];
}

export interface CreateDeviceRequest {
  device: Device;
}

export interface GetDeviceRequest {
  devEui: string;
}

export interface GetDeviceResponse {
  device: Device;
  deviceStatusBattery?: number;
  deviceStatusMargin?: number;
  deviceStatusExternalPowerSource?: boolean;
  lastSeenAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateDeviceRequest {
  device: Device;
}

export interface DeleteDeviceRequest {
  devEui: string;
}

// Device Activation
export interface DeviceActivation {
  devEui: string;
  devAddr: string;
  appSKey: string;
  nwkSEncKey: string;
  sNwkSIntKey: string;
  fNwkSIntKey: string;
  fCntUp: number;
  nFCntDown: number;
  aFCntDown: number;
}

export interface GetDeviceActivationResponse {
  deviceActivation: DeviceActivation;
}

export interface ActivateDeviceRequest {
  deviceActivation: DeviceActivation;
}

// Device Keys
export interface DeviceKeys {
  devEui: string;
  nwkKey: string;
  appKey?: string;
}

export interface GetDeviceKeysResponse {
  deviceKeys: DeviceKeys;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeviceKeysRequest {
  deviceKeys: DeviceKeys;
}

export interface UpdateDeviceKeysRequest {
  deviceKeys: DeviceKeys;
}

// Device Metrics
export interface DeviceMetrics {
  rxPackets: number;
  gwRssi: number;
  gwSnr: number;
  rxPacketsPerFrequency: { [key: string]: number };
  rxPacketsPerDr: { [key: string]: number };
  errors: number;
}

export interface GetDeviceMetricsResponse {
  metrics: DeviceMetrics;
}

// Device Link Metrics
export interface DeviceLinkMetric {
  time: string;
  rxPackets: number;
  gwRssi: number;
  gwSnr: number;
  rxPacketsPerFrequency: { [key: string]: number };
  rxPacketsPerDr: { [key: string]: number };
  errors: number;
}

export interface GetDeviceLinkMetricsRequest {
  devEui: string;
  start: string;
  end: string;
  aggregation?: string;
}

export interface GetDeviceLinkMetricsResponse {
  result: DeviceLinkMetric[];
}

// Device Queue
export interface DeviceQueueItem {
  id: string;
  devEui: string;
  confirmed: boolean;
  fPort: number;
  data: string;
  object?: any;
  isPending: boolean;
  fCntDown?: number;
}

export interface GetDeviceQueueResponse {
  totalCount: number;
  result: DeviceQueueItem[];
}

export interface EnqueueDeviceQueueItemRequest {
  queueItem: {
    devEui: string;
    confirmed: boolean;
    fPort: number;
    data: string;
    object?: any;
  };
}

export interface EnqueueDeviceQueueItemResponse {
  id: string;
}

export interface FlushDeviceQueueRequest {
  devEui: string;
}

// Random DevAddr
export interface GetRandomDevAddrResponse {
  devAddr: string;
}

// Next FCnt Down
export interface GetNextFCntDownResponse {
  fCntDown: number;
}

// Deactivate Device
export interface DeactivateDeviceRequest {
  devEui: string;
}

// Device Events
export interface DeviceEvent {
  time: string;
  type: string;
  data?: string;
  dr?: number;
  fCnt?: number;
  fPort?: number;
  confirmed?: boolean;
}

export interface ListDeviceEventsRequest {
  devEui: string;
  limit?: number;
  offset?: number;
}

export interface ListDeviceEventsResponse {
  totalCount: number;
  result: DeviceEvent[];
}

// LoRaWAN Frames
export interface LoRaWANFrame {
  time: string;
  type: string; // 'ConfirmedDataUp', 'UnconfirmedDataDown', etc.
  devAddr?: string;
  devEui?: string;
  gatewayId?: string;
  fCnt?: number;
  fPort?: number;
  data?: string;
  dr?: number;
  frequency?: number;
  rssi?: number;
  snr?: number;
}

export interface ListLoRaWANFramesRequest {
  devEui: string;
  limit?: number;
  offset?: number;
}

export interface ListLoRaWANFramesResponse {
  totalCount: number;
  result: LoRaWANFrame[];
}

