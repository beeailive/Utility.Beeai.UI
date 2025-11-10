// angular import
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ApplicationService } from 'src/app/core/services/application.service';
import { DeviceService } from 'src/app/core/services/device.service';
import { DeviceProfileService } from 'src/app/core/services/device-profile.service';
import { TenantContextService } from 'src/app/core/services/tenant-context.service';
import { GetApplicationResponse } from 'src/app/core/models/application.model';
import { Device, DeviceListItem, CreateDeviceRequest } from 'src/app/core/models/device.model';
import { DeviceProfileListItem } from 'src/app/core/models/device-profile.model';

@Component({
  selector: 'app-application-detail',
  imports: [SharedModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './application-detail.component.html',
  styleUrls: ['./application-detail.component.scss']
})
export class ApplicationDetailComponent implements OnInit, OnDestroy {
  private applicationService = inject(ApplicationService);
  private deviceService = inject(DeviceService);
  private deviceProfileService = inject(DeviceProfileService);
  private tenantContextService = inject(TenantContextService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private routeSubscription?: Subscription;

  applicationId: string = '';
  application: GetApplicationResponse | null = null;
  loading = false;
  error: string | null = null;
  activeTab: string = 'devices';

  // Devices tab data
  devices: DeviceListItem[] = [];
  devicesLoading = false;
  devicesError: string | null = null;

  // Add device modal
  showAddDeviceModal = false;
  deviceProfiles: DeviceProfileListItem[] = [];
  loadingProfiles = false;
  saving = false;
  addDeviceTab: string = 'device'; // device, tags, variables

  newDevice: Device = {
    devEui: '',
    name: '',
    description: '',
    applicationId: '',
    deviceProfileId: '',
    skipFcntCheck: false,
    isDisabled: false,
    joinEui: '',
    tags: {},
    variables: {}
  };

  // For tags and variables
  newTagKey = '';
  newTagValue = '';
  newVariableKey = '';
  newVariableValue = '';

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.applicationId = params['id'];
      if (this.applicationId) {
        this.loadApplicationDetails();
        this.loadDevices();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  loadApplicationDetails(): void {
    this.loading = true;
    this.error = null;

    this.applicationService.getApplication(this.applicationId).subscribe({
      next: (response) => {
        this.application = response;
        this.loading = false;
        console.log('✅ Loaded application details:', this.application);
      },
      error: (err) => {
        this.error = 'Failed to load application details: ' + err.message;
        this.loading = false;
        console.error('Error loading application details:', err);
      }
    });
  }

  loadDevices(): void {
    this.devicesLoading = true;
    this.devicesError = null;

    this.deviceService.listDevices({ 
      applicationId: this.applicationId, 
      limit: 100, 
      offset: 0 
    }).subscribe({
      next: (response) => {
        this.devices = response.result;
        this.devicesLoading = false;
        console.log('✅ Loaded devices:', this.devices);
      },
      error: (err) => {
        this.devicesError = 'Failed to load devices: ' + err.message;
        this.devicesLoading = false;
        console.error('Error loading devices:', err);
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    
    // Load data for specific tabs when activated
    if (tab === 'devices' && this.devices.length === 0) {
      this.loadDevices();
    }
  }

  goBack(): void {
    this.router.navigate(['/applications']);
  }

  // Add device modal methods
  openAddDeviceModal(): void {
    const tenantId = this.tenantContextService.getSelectedTenantId();
    if (!tenantId) {
      this.devicesError = 'No tenant selected';
      return;
    }

    this.showAddDeviceModal = true;
    this.addDeviceTab = 'device';
    this.newDevice = {
      devEui: '',
      name: '',
      description: '',
      applicationId: this.applicationId,
      deviceProfileId: '',
      skipFcntCheck: false,
      isDisabled: false,
      joinEui: '',
      tags: {},
      variables: {}
    };
    this.newTagKey = '';
    this.newTagValue = '';
    this.newVariableKey = '';
    this.newVariableValue = '';
    this.loadDeviceProfiles(tenantId);
  }

  closeAddDeviceModal(): void {
    this.showAddDeviceModal = false;
    this.devicesError = null;
  }

  loadDeviceProfiles(tenantId: string): void {
    this.loadingProfiles = true;
    this.deviceProfileService.listDeviceProfiles({ tenantId, limit: 100, offset: 0 }).subscribe({
      next: (response) => {
        this.deviceProfiles = response.result;
        this.loadingProfiles = false;
        console.log('✅ Loaded device profiles:', this.deviceProfiles.length);
      },
      error: (err) => {
        this.devicesError = 'Failed to load device profiles: ' + err.message;
        this.loadingProfiles = false;
        console.error('Error loading device profiles:', err);
      }
    });
  }

  setAddDeviceTab(tab: string): void {
    this.addDeviceTab = tab;
  }

  addTag(): void {
    if (this.newTagKey && this.newTagValue) {
      if (!this.newDevice.tags) {
        this.newDevice.tags = {};
      }
      this.newDevice.tags[this.newTagKey] = this.newTagValue;
      this.newTagKey = '';
      this.newTagValue = '';
    }
  }

  removeTag(key: string): void {
    if (this.newDevice.tags) {
      delete this.newDevice.tags[key];
    }
  }

  addVariable(): void {
    if (this.newVariableKey && this.newVariableValue) {
      if (!this.newDevice.variables) {
        this.newDevice.variables = {};
      }
      this.newDevice.variables[this.newVariableKey] = this.newVariableValue;
      this.newVariableKey = '';
      this.newVariableValue = '';
    }
  }

  removeVariable(key: string): void {
    if (this.newDevice.variables) {
      delete this.newDevice.variables[key];
    }
  }

  saveDevice(): void {
    if (!this.newDevice.devEui || !this.newDevice.name || !this.newDevice.deviceProfileId) {
      this.devicesError = 'Please fill in all required fields';
      return;
    }

    this.saving = true;
    this.devicesError = null;

    const request: CreateDeviceRequest = {
      device: this.newDevice
    };

    this.deviceService.createDevice(request).subscribe({
      next: () => {
        console.log('✅ Device created successfully');
        this.saving = false;
        this.closeAddDeviceModal();
        this.loadDevices();
      },
      error: (err) => {
        this.devicesError = 'Failed to create device: ' + err.message;
        this.saving = false;
        console.error('Error creating device:', err);
      }
    });
  }

  // Helper for template
  Object = Object;
}

