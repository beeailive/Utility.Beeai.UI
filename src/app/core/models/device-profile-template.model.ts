export interface DeviceProfileTemplate {
  id: string;
  name: string;
  description?: string;
  vendor?: string;
  firmware?: string;
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
  tags?: { [key: string]: string };
  measurements?: { [key: string]: Measurement };
  autoDetectMeasurements: boolean;
}

export interface Measurement {
  name: string;
  kind: string;
}

export interface DeviceProfileTemplateListItem {
  id: string;
  name: string;
  description?: string;
  vendor?: string;
  firmware?: string;
  region: string;
  macVersion: string;
  regParamsRevision: string;
  supportsOtaa: boolean;
  supportsClassB: boolean;
  supportsClassC: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListDeviceProfileTemplatesRequest {
  limit?: number;
  offset?: number;
}

export interface ListDeviceProfileTemplatesResponse {
  totalCount: number;
  result: DeviceProfileTemplateListItem[];
}

export interface CreateDeviceProfileTemplateRequest {
  deviceProfileTemplate: DeviceProfileTemplate;
}

export interface CreateDeviceProfileTemplateResponse {
  id: string;
}

export interface GetDeviceProfileTemplateRequest {
  id: string;
}

export interface GetDeviceProfileTemplateResponse {
  deviceProfileTemplate: DeviceProfileTemplate;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateDeviceProfileTemplateRequest {
  deviceProfileTemplate: DeviceProfileTemplate;
}

export interface DeleteDeviceProfileTemplateRequest {
  id: string;
}

