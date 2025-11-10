export interface DeviceProfile {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  region: string;
  macVersion: string;
  regParamsRevision: string;
  adrAlgorithmId: string;
  payloadCodecRuntime?: string;
  payloadCodecScript?: string;
  flushQueueOnActivate: boolean;
  uplinkInterval: number;
  deviceStatusReqInterval: number;
  supportsOtaa: boolean;
  supportsClassB: boolean;
  supportsClassC: boolean;
  classBTimeout: number;
  classBPingSlotPeriod: number;
  classBPingSlotDr: number;
  classBPingSlotFreq: number;
  classCTimeout: number;
  abpRx1Delay: number;
  abpRx1DrOffset: number;
  abpRx2Dr: number;
  abpRx2Freq: number;
  relayEnabled?: boolean;
  relayCadPeriodicity?: number;
  relayDefaultChannelIndex?: number;
  relaySecondChannelFreq?: number;
  relaySecondChannelDr?: number;
  relaySecondChannelAckOffset?: number;
  tags?: { [key: string]: string };
  measurements?: { [key: string]: Measurement };
  autoDetectMeasurements: boolean;
}

export interface Measurement {
  name: string;
  kind: string;
}

export interface DeviceProfileListItem {
  id: string;
  name: string;
  region: string;
  macVersion: string;
  regParamsRevision: string;
  supportsOtaa: boolean;
  supportsClassB: boolean;
  supportsClassC: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListDeviceProfilesRequest {
  tenantId: string;
  limit?: number;
  offset?: number;
  search?: string;
}

export interface ListDeviceProfilesResponse {
  totalCount: number;
  result: DeviceProfileListItem[];
}

export interface CreateDeviceProfileRequest {
  deviceProfile: DeviceProfile;
}

export interface CreateDeviceProfileResponse {
  id: string;
}

export interface GetDeviceProfileRequest {
  id: string;
}

export interface GetDeviceProfileResponse {
  deviceProfile: DeviceProfile;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateDeviceProfileRequest {
  deviceProfile: DeviceProfile;
}

export interface DeleteDeviceProfileRequest {
  id: string;
}

export interface AdrAlgorithm {
  id: string;
  name: string;
}

export interface ListAdrAlgorithmsResponse {
  totalCount: number;
  result: AdrAlgorithm[];
}

