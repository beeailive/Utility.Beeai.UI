// angular import
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DeviceProfileTemplateService } from 'src/app/core/services/device-profile-template.service';
import { DeviceProfileService } from 'src/app/core/services/device-profile.service';
import { RegionService } from 'src/app/core/services/region.service';
import { DeviceProfileTemplate, DeviceProfileTemplateListItem } from 'src/app/core/models/device-profile-template.model';
import { AdrAlgorithm } from 'src/app/core/models/device-profile.model';
import { RegionListItem } from 'src/app/core/models/region.model';

@Component({
  selector: 'app-device-profile-templates',
  imports: [SharedModule, CommonModule, FormsModule],
  templateUrl: './device-profile-templates.component.html',
  styleUrls: ['./device-profile-templates.component.scss']
})
export class DeviceProfileTemplatesComponent implements OnInit {
  private templateService = inject(DeviceProfileTemplateService);
  private deviceProfileService = inject(DeviceProfileService);
  private regionService = inject(RegionService);

  templates: DeviceProfileTemplateListItem[] = [];
  loading = false;
  error: string | null = null;
  totalCount = 0;

  // Add Template Modal
  showAddModal = false;
  saving = false;
  regions: RegionListItem[] = [];
  adrAlgorithms: AdrAlgorithm[] = [];

  newTemplate: DeviceProfileTemplate = this.getEmptyTemplate();

  // Active tab in modal
  activeTab: string = 'general';

  // Tag and Measurement entries for Add Modal
  tagEntries: { key: string; value: string }[] = [];
  measurementEntries: { key: string; value: { name: string; kind: string } }[] = [];

  macVersions = [
    { value: 'LORAWAN_1_0_0', label: 'LoRaWAN 1.0.0' },
    { value: 'LORAWAN_1_0_1', label: 'LoRaWAN 1.0.1' },
    { value: 'LORAWAN_1_0_2', label: 'LoRaWAN 1.0.2' },
    { value: 'LORAWAN_1_0_3', label: 'LoRaWAN 1.0.3' },
    { value: 'LORAWAN_1_0_4', label: 'LoRaWAN 1.0.4' },
    { value: 'LORAWAN_1_1_0', label: 'LoRaWAN 1.1.0' }
  ];

  regParamsRevisions = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'RP002-1.0.0', label: 'RP002-1.0.0' },
    { value: 'RP002-1.0.1', label: 'RP002-1.0.1' },
    { value: 'RP002-1.0.2', label: 'RP002-1.0.2' },
    { value: 'RP002-1.0.3', label: 'RP002-1.0.3' }
  ];

  ngOnInit(): void {
    this.loadTemplates();
    this.loadRegions();
    this.loadAdrAlgorithms();
  }

  getEmptyTemplate(): DeviceProfileTemplate {
    return {
      id: '',
      name: '',
      description: '',
      vendor: '',
      firmware: '',
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
      tags: {},
      measurements: {},
      autoDetectMeasurements: true
    };
  }

  loadRegions(): void {
    this.regionService.listRegions({ limit: 100 }).subscribe({
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

  loadTemplates(): void {
    this.loading = true;
    this.error = null;

    this.templateService.listDeviceProfileTemplates({ limit: 100 }).subscribe({
      next: (response) => {
        this.templates = response.result;
        this.totalCount = response.totalCount;
        this.loading = false;
        console.log('✅ Loaded device profile templates:', this.totalCount);
      },
      error: (err) => {
        this.error = 'Failed to load templates: ' + err.message;
        this.loading = false;
        console.error('Error loading templates:', err);
      }
    });
  }

  deleteTemplate(id: string): void {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }

    this.templateService.deleteDeviceProfileTemplate(id).subscribe({
      next: () => {
        console.log('✅ Template deleted successfully');
        this.loadTemplates();
      },
      error: (err) => {
        this.error = 'Failed to delete template: ' + err.message;
        console.error('Error deleting template:', err);
      }
    });
  }

  openAddModal(): void {
    this.newTemplate = this.getEmptyTemplate();
    this.tagEntries = [];
    this.measurementEntries = [];
    this.showAddModal = true;
    this.activeTab = 'general';
    this.error = null;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.newTemplate = this.getEmptyTemplate();
    this.tagEntries = [];
    this.measurementEntries = [];
    this.activeTab = 'general';
    this.error = null;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  saveTemplate(): void {
    if (!this.newTemplate.name || !this.newTemplate.region) {
      this.error = 'Please fill in all required fields';
      return;
    }

    // Convert tag entries to tags object
    this.newTemplate.tags = {};
    this.tagEntries.forEach(entry => {
      if (entry.key && entry.value) {
        this.newTemplate.tags![entry.key] = entry.value;
      }
    });

    // Convert measurement entries to measurements object
    this.newTemplate.measurements = {};
    this.measurementEntries.forEach(entry => {
      if (entry.key && entry.value.name) {
        this.newTemplate.measurements![entry.key] = entry.value;
      }
    });

    this.saving = true;
    this.error = null;

    this.templateService.createDeviceProfileTemplate({ deviceProfileTemplate: this.newTemplate }).subscribe({
      next: (response) => {
        console.log('✅ Template created successfully:', response.id);
        this.saving = false;
        this.closeAddModal();
        this.loadTemplates();
      },
      error: (err) => {
        this.error = 'Failed to create template: ' + err.message;
        this.saving = false;
        console.error('Error creating template:', err);
      }
    });
  }

  // Tag management methods
  addTag(): void {
    this.tagEntries.push({ key: '', value: '' });
  }

  removeTag(index: number): void {
    this.tagEntries.splice(index, 1);
  }

  // Measurement management methods
  addMeasurement(): void {
    this.measurementEntries.push({
      key: '',
      value: { name: '', kind: 'COUNTER' }
    });
  }

  removeMeasurement(index: number): void {
    this.measurementEntries.splice(index, 1);
  }
}

