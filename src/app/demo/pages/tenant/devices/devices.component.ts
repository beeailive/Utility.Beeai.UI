import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedModule } from '../../../../theme/shared/shared.module';
import { DeviceService } from '../../../../core/services/device.service';
import { TenantContextService } from '../../../../core/services/tenant-context.service';
import { DeviceListItem } from '../../../../core/models/device.model';

@Component({
  selector: 'app-devices',
  imports: [SharedModule, CommonModule, RouterModule],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit, OnDestroy {
  private deviceService = inject(DeviceService);
  private tenantContextService = inject(TenantContextService);
  private router = inject(Router);
  private tenantSubscription?: Subscription;

  devices: DeviceListItem[] = [];
  loading = false;
  error: string | null = null;
  totalCount = 0;

  selectedTenantId: string | null = null;
  selectedTenantName: string | null = null;

  ngOnInit(): void {
    this.tenantSubscription = this.tenantContextService.selectedTenant$.subscribe(tenant => {
      this.selectedTenantId = tenant?.id || null;
      this.selectedTenantName = tenant?.name || null;
      
      if (this.selectedTenantId) {
        this.loadDevices();
      }
    });
  }

  ngOnDestroy(): void {
    this.tenantSubscription?.unsubscribe();
  }

  loadDevices(): void {
    this.loading = true;
    this.error = null;

    this.deviceService.listDevices({ limit: 100, offset: 0 }).subscribe({
      next: (response) => {
        this.devices = response.result;
        this.totalCount = response.totalCount;
        this.loading = false;
         
      },
      error: (err) => {
        this.error = 'Failed to load devices: ' + err.message;
        this.loading = false;
        console.error('Error loading devices:', err);
      }
    });
  }

  viewDevice(devEui: string): void {
    this.router.navigate(['/devices', devEui]);
  }

  deleteDevice(devEui: string): void {
    if (confirm('Are you sure you want to delete this device?')) {
      this.deviceService.deleteDevice(devEui).subscribe({
        next: () => {
          this.loadDevices();
        },
        error: (err) => {
          this.error = 'Failed to delete device: ' + err.message;
          console.error('Error deleting device:', err);
        }
      });
    }
  }
}

