// angular import
import { Component, OnInit, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TenantContextService } from 'src/app/core/services/tenant-context.service';
import { GatewayService } from 'src/app/core/services/gateway.service';
import { ApplicationService } from 'src/app/core/services/application.service';
import { DeviceService } from 'src/app/core/services/device.service';
import { GatewayListItem } from 'src/app/core/models/gateway.model';
import { DeviceListItem } from 'src/app/core/models/device.model';

// 3rd party import
import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-tenant-dashboard',
  imports: [SharedModule, NgApexchartsModule, CommonModule],
  templateUrl: './tenant-dashboard.component.html',
  styleUrls: ['./tenant-dashboard.component.scss']
})
export class TenantDashboardComponent implements OnInit {
  private tenantContextService = inject(TenantContextService);
  private gatewayService = inject(GatewayService);
  private applicationService = inject(ApplicationService);
  private deviceService = inject(DeviceService);

  // Selected tenant
  selectedTenantId: string | null = null;
  selectedTenantName: string | null = null;

  // Dashboard stats
  totalGateways = 0;
  totalApplications = 0;
  totalDevices = 0;
  activeDevices = 0;
  inactiveDevices = 0;
  activeGateways = 0;
  inactiveGateways = 0;
  loading = false;

  // Device data-rate usage
  deviceDataRates: { [key: string]: number } = {};
  totalDataRatePackets = 0;
  dataRateLabels: string[] = [];
  dataRateValues: number[] = [];
  dataRateColors: string[] = ['#4680ff', '#2ed8b6', '#ff5370', '#ffba57', '#9ccc65', '#ab47bc'];

  // Chart options
  activeDevicesChartOptions!: Partial<ApexOptions>;
  activeGatewaysChartOptions!: Partial<ApexOptions>;
  dataRateChartOptions!: Partial<ApexOptions>;

  ngOnInit(): void {
    this.initializeCharts();

    // Subscribe to selected tenant changes
    this.tenantContextService.selectedTenant$.subscribe(tenant => {
      this.selectedTenantId = tenant?.id || null;
      this.selectedTenantName = tenant?.name || null;

      if (this.selectedTenantId) {
        this.loadDashboardData();
      } else {
        this.resetDashboard();
      }
    });
  }

  initializeCharts(): void {
    // Active Devices Chart
    this.activeDevicesChartOptions = {
      chart: {
        type: 'donut',
        height: 250
      },
      labels: ['Active', 'Inactive'],
      colors: ['#2ed8b6', '#ff5370'],
      series: [0, 0],
      legend: {
        show: true,
        position: 'bottom'
      },
      dataLabels: {
        enabled: true
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Devices',
                formatter: () => '0'
              }
            }
          }
        }
      }
    };

    // Active Gateways Chart
    this.activeGatewaysChartOptions = {
      chart: {
        type: 'donut',
        height: 250
      },
      labels: ['Active', 'Inactive'],
      colors: ['#4680ff', '#ff5370'],
      series: [0, 0],
      legend: {
        show: true,
        position: 'bottom'
      },
      dataLabels: {
        enabled: true
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Gateways',
                formatter: () => '0'
              }
            }
          }
        }
      }
    };

    // Data Rate Chart
    this.dataRateChartOptions = {
      chart: {
        type: 'donut',
        height: 250
      },
      labels: [],
      colors: this.dataRateColors,
      series: [],
      legend: {
        show: true,
        position: 'bottom'
      },
      dataLabels: {
        enabled: true
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Packets',
                formatter: () => '0'
              }
            }
          }
        }
      }
    };
  }

  resetDashboard(): void {
    this.totalGateways = 0;
    this.totalApplications = 0;
    this.totalDevices = 0;
    this.activeDevices = 0;
    this.inactiveDevices = 0;
    this.activeGateways = 0;
    this.inactiveGateways = 0;
    this.deviceDataRates = {};
    this.totalDataRatePackets = 0;
    this.updateCharts();
  }

  loadDashboardData(): void {
    if (!this.selectedTenantId) return;

    this.loading = true;

    // Load Gateways for selected tenant
    this.gatewayService.listGateways({ tenantId: this.selectedTenantId, limit: 1000, offset: 0 }).subscribe({
      next: (response) => {
        this.totalGateways = response.totalCount;

        // Calculate active/inactive gateways (active if seen in last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        this.activeGateways = response.result.filter((gw: GatewayListItem) => {
          if (!gw.lastSeenAt) return false;
          const lastSeen = new Date(gw.lastSeenAt);
          return lastSeen > fiveMinutesAgo;
        }).length;
        this.inactiveGateways = this.totalGateways - this.activeGateways;

        console.log('✅ Gateway stats:', {
          total: this.totalGateways,
          active: this.activeGateways,
          inactive: this.inactiveGateways
        });

        this.updateCharts();
      },
      error: (err) => console.error('Error loading gateways:', err)
    });

    // Load Applications for selected tenant
    this.applicationService.listApplications({ tenantId: this.selectedTenantId, limit: 1000, offset: 0 }).subscribe({
      next: (response) => {
        this.totalApplications = response.totalCount;

        // Load devices for each application
        this.loadDevicesForApplications(response.result.map((app: any) => app.id));
      },
      error: (err) => console.error('Error loading applications:', err)
    });
  }

  loadDevicesForApplications(applicationIds: string[]): void {
    if (applicationIds.length === 0) {
      this.totalDevices = 0;
      this.activeDevices = 0;
      this.inactiveDevices = 0;
      this.loading = false;
      this.updateCharts();
      return;
    }

    let allDevices: DeviceListItem[] = [];
    let completedRequests = 0;

    applicationIds.forEach(appId => {
      this.deviceService.listDevices({ applicationId: appId, limit: 1000, offset: 0 }).subscribe({
        next: (response) => {
          allDevices = allDevices.concat(response.result);
          completedRequests++;

          if (completedRequests === applicationIds.length) {
            this.processDevices(allDevices);
          }
        },
        error: (err) => {
          console.error(`Error loading devices for app ${appId}:`, err);
          completedRequests++;

          if (completedRequests === applicationIds.length) {
            this.processDevices(allDevices);
          }
        }
      });
    });
  }

  processDevices(devices: DeviceListItem[]): void {
    this.totalDevices = devices.length;

    // Calculate active/inactive devices (active if seen in last 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    this.activeDevices = devices.filter((device: DeviceListItem) => {
      if (!device.lastSeenAt) return false;
      const lastSeen = new Date(device.lastSeenAt);
      return lastSeen > oneHourAgo;
    }).length;
    this.inactiveDevices = this.totalDevices - this.activeDevices;

    console.log('✅ Device stats:', {
      total: this.totalDevices,
      active: this.activeDevices,
      inactive: this.inactiveDevices
    });

    this.loading = false;
    this.updateCharts();
  }

  updateCharts(): void {
    // Update Active Devices Chart
    this.activeDevicesChartOptions = {
      ...this.activeDevicesChartOptions,
      series: [this.activeDevices, this.inactiveDevices],
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Devices',
                formatter: () => this.totalDevices.toString()
              }
            }
          }
        }
      }
    };

    // Update Active Gateways Chart
    this.activeGatewaysChartOptions = {
      ...this.activeGatewaysChartOptions,
      series: [this.activeGateways, this.inactiveGateways],
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Gateways',
                formatter: () => this.totalGateways.toString()
              }
            }
          }
        }
      }
    };
  }
}

