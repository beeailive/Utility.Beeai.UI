export interface Region {
  id: string;
  name: string;
  description?: string;
  region: string;
  userInfo?: string;
  uplinkChannels?: number[];
  rx1Delay?: number;
  rx1DrOffset?: number;
  rx2Dr?: number;
  rx2Frequency?: number;
  classBPingSlotDr?: number;
  classBPingSlotFrequency?: number;
}

export interface RegionListItem {
  id: string;
  name: string;
  description: string;
  region: string;
}

export interface ListRegionsRequest {
  limit?: number;
  offset?: number;
}

export interface ListRegionsResponse {
  totalCount: number;
  result: RegionListItem[];
}

export interface GetRegionResponse {
  region: Region;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRegionRequest {
  region: Region;
}

export interface UpdateRegionRequest {
  region: Region;
}

