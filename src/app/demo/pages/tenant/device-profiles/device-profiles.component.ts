// angular import
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DeviceProfileService } from 'src/app/core/services/device-profile.service';
import { RegionService } from 'src/app/core/services/region.service';
import { TenantContextService } from 'src/app/core/services/tenant-context.service';
import { DeviceProfileListItem, ListDeviceProfilesRequest, DeviceProfile, AdrAlgorithm } from 'src/app/core/models/device-profile.model';
import { RegionListItem } from 'src/app/core/models/region.model';

@Component({
  selector: 'app-device-profiles',
  imports: [SharedModule, CommonModule, FormsModule],
  templateUrl: './device-profiles.component.html',
  styleUrls: ['./device-profiles.component.scss']
})
export class DeviceProfilesComponent implements OnInit {
  private deviceProfileService = inject(DeviceProfileService);
  private regionService = inject(RegionService);
  private tenantContextService = inject(TenantContextService);

  // Expose Object for template
  Object = Object;

  deviceProfiles: DeviceProfileListItem[] = [];
  loading = false;
  error: string | null = null;
  totalCount = 0;

  selectedTenantId: string | null = null;
  selectedTenantName: string | null = null;

  // Add/View Device Profile Modal
  showAddModal = false;
  showViewModal = false;
  saving = false;
  regions: RegionListItem[] = [];
  adrAlgorithms: AdrAlgorithm[] = [];

  newDeviceProfile: DeviceProfile = this.getEmptyDeviceProfile();
  selectedDeviceProfile: DeviceProfile | null = null;

  // Active tab in modal
  activeTab: string = 'general';

  // Tags and Measurements for Add Modal
  tagEntries: { key: string; value: string }[] = [];
  measurementEntries: { key: string; value: { name: string; kind: string } }[] = [];

  // Tags and Measurements for View Modal
  viewTagEntries: { key: string; value: string }[] = [];
  viewMeasurementEntries: { key: string; value: { name: string; kind: string } }[] = [];

  ngOnInit(): void {
    // Load regions and ADR algorithms
    this.loadRegions();
    this.loadAdrAlgorithms();

    // Subscribe to selected tenant changes
    this.tenantContextService.selectedTenant$.subscribe(tenant => {
      this.selectedTenantId = tenant?.id || null;
      this.selectedTenantName = tenant?.name || null;

      if (this.selectedTenantId) {
        this.loadDeviceProfiles();
      } else {
        this.deviceProfiles = [];
        this.totalCount = 0;
      }
    });
  }

  getEmptyDeviceProfile(): DeviceProfile {
    return {
      id: '',
      tenantId: '',
      name: '',
      description: '',
      region: '',
      macVersion: 'LORAWAN_1_0_3',
      regParamsRevision: 'A',
      adrAlgorithmId: 'default',
      payloadCodecRuntime: '',
      payloadCodecScript: '',
      flushQueueOnActivate: false,
      uplinkInterval: 3600,
      deviceStatusReqInterval: 1,
      supportsOtaa: true,
      supportsClassB: false,
      supportsClassC: false,
      classBTimeout: 0,
      classBPingSlotPeriod: 0,
      classBPingSlotDr: 0,
      classBPingSlotFreq: 0,
      classCTimeout: 0,
      abpRx1Delay: 0,
      abpRx1DrOffset: 0,
      abpRx2Dr: 0,
      abpRx2Freq: 0,
      relayEnabled: false,
      relayCadPeriodicity: 1,
      relayDefaultChannelIndex: 0,
      relaySecondChannelFreq: 0,
      relaySecondChannelDr: 0,
      relaySecondChannelAckOffset: 0,
      autoDetectMeasurements: true
    };
  }

  loadRegions(): void {
    this.regionService.listRegions({ limit: 100, offset: 0 }).subscribe({
      next: (response) => {
        this.regions = response.result;
        console.log('✅ Loaded regions:', this.regions.length);
      },
      error: (err) => {
        console.error('Error loading regions:', err);
      }
    });
  }

  loadAdrAlgorithms(): void {
    this.deviceProfileService.listAdrAlgorithms().subscribe({
      next: (response) => {
        this.adrAlgorithms = response.result;
        console.log('✅ Loaded ADR algorithms:', this.adrAlgorithms.length);
      },
      error: (err) => {
        console.error('Error loading ADR algorithms:', err);
      }
    });
  }

  loadDeviceProfiles(): void {
    if (!this.selectedTenantId) {
      this.error = 'Please select a tenant first';
      return;
    }

    this.loading = true;
    this.error = null;

    const request: ListDeviceProfilesRequest = {
      limit: 100,
      offset: 0,
      tenantId: this.selectedTenantId
    };

    this.deviceProfileService.listDeviceProfiles(request).subscribe({
      next: (response) => {
        this.deviceProfiles = response.result;
        this.totalCount = response.totalCount;
        this.loading = false;
        console.log('✅ Loaded device profiles:', this.totalCount);
      },
      error: (err) => {
        this.error = 'Failed to load device profiles: ' + err.message;
        this.loading = false;
        console.error('Error loading device profiles:', err);
      }
    });
  }

  deleteDeviceProfile(id: string): void {
    if (!confirm('Are you sure you want to delete this device profile?')) {
      return;
    }

    this.deviceProfileService.deleteDeviceProfile(id).subscribe({
      next: () => {
        console.log('✅ Device profile deleted successfully');
        this.loadDeviceProfiles();
      },
      error: (err) => {
        this.error = 'Failed to delete device profile: ' + err.message;
        console.error('Error deleting device profile:', err);
      }
    });
  }

  openAddModal(): void {
    if (!this.selectedTenantId) {
      alert('Please select a tenant first');
      return;
    }
    this.newDeviceProfile = this.getEmptyDeviceProfile();
    this.newDeviceProfile.tenantId = this.selectedTenantId;
    this.activeTab = 'general';
    this.showAddModal = true;
    this.error = null;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.activeTab = 'general';
    this.newDeviceProfile = this.getEmptyDeviceProfile();
    this.tagEntries = [];
    this.measurementEntries = [];
  }

  openViewModal(deviceProfile: DeviceProfileListItem): void {
    this.loading = true;
    this.error = null;

    // Fetch full device profile details
    this.deviceProfileService.getDeviceProfile(deviceProfile.id).subscribe({
      next: (response) => {
        this.selectedDeviceProfile = response.deviceProfile;

        // Convert tags object to array for editing
        this.viewTagEntries = [];
        if (this.selectedDeviceProfile.tags) {
          this.viewTagEntries = Object.entries(this.selectedDeviceProfile.tags).map(([key, value]) => ({
            key,
            value
          }));
        }

        // Convert measurements object to array for editing
        this.viewMeasurementEntries = [];
        if (this.selectedDeviceProfile.measurements) {
          this.viewMeasurementEntries = Object.entries(this.selectedDeviceProfile.measurements).map(([key, value]) => ({
            key,
            value
          }));
        }

        this.activeTab = 'general';
        this.showViewModal = true;
        this.loading = false;
        console.log('✅ Loaded device profile details:', this.selectedDeviceProfile);
      },
      error: (err) => {
        this.error = 'Failed to load device profile details: ' + err.message;
        this.loading = false;
        console.error('Error loading device profile details:', err);
      }
    });
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.activeTab = 'general';
    this.selectedDeviceProfile = null;
    this.viewTagEntries = [];
    this.viewMeasurementEntries = [];
  }

  updateDeviceProfile(): void {
    if (!this.selectedDeviceProfile) {
      return;
    }

    // Validation
    if (!this.selectedDeviceProfile.name || !this.selectedDeviceProfile.region) {
      this.error = 'Please fill in all required fields (Name, Region)';
      return;
    }

    this.saving = true;
    this.error = null;

    // Convert tag entries to object
    if (this.viewTagEntries.length > 0) {
      const tags: { [key: string]: string } = {};
      this.viewTagEntries.forEach(tag => {
        if (tag.key && tag.value) {
          tags[tag.key] = tag.value;
        }
      });
      this.selectedDeviceProfile.tags = tags;
    } else {
      this.selectedDeviceProfile.tags = undefined;
    }

    // Convert measurement entries to object
    if (this.viewMeasurementEntries.length > 0) {
      const measurements: { [key: string]: { name: string; kind: string } } = {};
      this.viewMeasurementEntries.forEach(measurement => {
        if (measurement.key && measurement.value.name) {
          measurements[measurement.key] = measurement.value;
        }
      });
      this.selectedDeviceProfile.measurements = measurements;
    } else {
      this.selectedDeviceProfile.measurements = undefined;
    }

    this.deviceProfileService.updateDeviceProfile(this.selectedDeviceProfile.id, {
      deviceProfile: this.selectedDeviceProfile
    }).subscribe({
      next: () => {
        console.log('✅ Device profile updated successfully');
        this.saving = false;
        this.closeViewModal();
        this.loadDeviceProfiles(); // Reload list
      },
      error: (err) => {
        this.error = 'Failed to update device profile: ' + err.message;
        this.saving = false;
        console.error('Error updating device profile:', err);
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  saveDeviceProfile(): void {
    if (!this.selectedTenantId) {
      this.error = 'Please select a tenant first';
      return;
    }

    if (!this.newDeviceProfile.name || !this.newDeviceProfile.region) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.saving = true;
    this.error = null;

    this.newDeviceProfile.tenantId = this.selectedTenantId;

    // Convert tag entries to object
    if (this.tagEntries.length > 0) {
      this.newDeviceProfile.tags = {};
      this.tagEntries.forEach(tag => {
        if (tag.key && tag.value) {
          this.newDeviceProfile.tags![tag.key] = tag.value;
        }
      });
    }

    // Convert measurement entries to object
    if (this.measurementEntries.length > 0) {
      this.newDeviceProfile.measurements = {};
      this.measurementEntries.forEach(measurement => {
        if (measurement.key && measurement.value.name) {
          this.newDeviceProfile.measurements![measurement.key] = measurement.value;
        }
      });
    }

    this.deviceProfileService.createDeviceProfile({ deviceProfile: this.newDeviceProfile }).subscribe({
      next: (response) => {
        console.log('✅ Device profile created successfully:', response.id);
        this.saving = false;
        this.closeAddModal();
        this.loadDeviceProfiles();
      },
      error: (err) => {
        this.error = 'Failed to create device profile: ' + err.message;
        this.saving = false;
        console.error('Error creating device profile:', err);
      }
    });
  }

  // Tag management methods for Add Modal
  addTag(): void {
    this.tagEntries.push({ key: '', value: '' });
  }

  removeTag(index: number): void {
    this.tagEntries.splice(index, 1);
  }

  // Measurement management methods for Add Modal
  addMeasurement(): void {
    this.measurementEntries.push({
      key: '',
      value: { name: '', kind: 'COUNTER' }
    });
  }

  removeMeasurement(index: number): void {
    this.measurementEntries.splice(index, 1);
  }

  // Tag management methods for View Modal
  addViewTag(): void {
    this.viewTagEntries.push({ key: '', value: '' });
  }

  removeViewTag(index: number): void {
    this.viewTagEntries.splice(index, 1);
  }

  // Measurement management methods for View Modal
  addViewMeasurement(): void {
    this.viewMeasurementEntries.push({
      key: '',
      value: { name: '', kind: 'COUNTER' }
    });
  }

  removeViewMeasurement(index: number): void {
    this.viewMeasurementEntries.splice(index, 1);
  }
}

