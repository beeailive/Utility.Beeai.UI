// angular import
import { Component, viewChild, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// import * as L from 'leaflet';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TenantService } from 'src/app/core/services/tenant.service';
import { UserService } from 'src/app/core/services/user.service';
import { GatewayService } from 'src/app/core/services/gateway.service';
import { ApplicationService } from 'src/app/core/services/application.service';
import { DeviceService } from 'src/app/core/services/device.service';
import { GatewayListItem } from 'src/app/core/models/gateway.model';
import { DeviceListItem } from 'src/app/core/models/device.model';

// 3rd party import

import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
@Component({
  selector: 'app-dash-analytics',
  imports: [SharedModule, NgApexchartsModule, CommonModule],
  templateUrl: './dash-analytics.component.html',
  styleUrls: ['./dash-analytics.component.scss']
})
export class DashAnalyticsComponent implements OnInit {
  private tenantService = inject(TenantService);
  private userService = inject(UserService);
  private gatewayService = inject(GatewayService);
  private applicationService = inject(ApplicationService);
  private deviceService = inject(DeviceService);

  // Dashboard stats
  totalTenants = 0;
  totalUsers = 0;
  totalGateways = 0;
  totalApplications = 0;
  totalDevices = 0;
  activeDevices = 0;
  inactiveDevices = 0;
  activeGateways = 0;
  inactiveGateways = 0;
  loading = false;

  // Gateway locations for map (commented out for now)
  // gatewayLocations: { lat: number; lng: number; name: string; }[] = [];
  // private map: L.Map | null = null;

  // Device data-rate usage
  deviceDataRates: { [key: string]: number } = {};
  totalDataRatePackets = 0;
  dataRateLabels: string[] = [];
  dataRateValues: number[] = [];
  dataRateColors: string[] = ['#4680ff', '#2ed8b6', '#ff5370', '#ffba57', '#9ccc65', '#ab47bc'];

  // public props
  chart = viewChild<ChartComponent>('chart');
  customerChart = viewChild<ChartComponent>('customerChart');
  chartOptions!: Partial<ApexOptions>;
  chartOptions_1!: Partial<ApexOptions>;
  chartOptions_2!: Partial<ApexOptions>;
  chartOptions_3!: Partial<ApexOptions>;

  // constructor
  constructor() {
    this.chartOptions = {
      chart: {
        height: 205,
        type: 'line',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      series: [
        {
          name: 'Arts',
          data: [20, 50, 30, 60, 30, 50]
        },
        {
          name: 'Commerce',
          data: [60, 30, 65, 45, 67, 35]
        }
      ],
      legend: {
        position: 'top'
      },
      xaxis: {
        type: 'datetime',
        categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000'],
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        show: true,
        min: 10,
        max: 70
      },
      colors: ['#73b4ff', '#59e0c5'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          gradientToColors: ['#4099ff', '#2ed8b6'],
          shadeIntensity: 0.5,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      grid: {
        borderColor: '#cccccc3b'
      }
    };
    // Active Devices Chart
    this.chartOptions_1 = {
      chart: {
        height: 150,
        type: 'donut'
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%'
          }
        }
      },
      labels: ['Active', 'Inactive'],
      series: [0, 0],
      legend: {
        show: false
      },
      tooltip: {
        theme: 'dark'
      },
      grid: {
        padding: {
          top: 20,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      colors: ['#2ed8b6', '#ff5370'],
      fill: {
        opacity: [1, 1]
      },
      stroke: {
        width: 0
      }
    };
    // Active Gateways Chart
    this.chartOptions_2 = {
      chart: {
        height: 150,
        type: 'donut'
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%'
          }
        }
      },
      labels: ['Active', 'Inactive'],
      series: [0, 0],
      legend: {
        show: false
      },
      tooltip: {
        theme: 'dark'
      },
      grid: {
        padding: {
          top: 20,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      colors: ['#4680ff', '#ff5370'],
      fill: {
        opacity: [1, 1]
      },
      stroke: {
        width: 0
      }
    };
    // Device Data-Rate Usage Chart - Donut Chart
    this.chartOptions_3 = {
      chart: {
        type: 'donut',
        height: 200
      },
      dataLabels: {
        enabled: false
      },
      colors: this.dataRateColors,
      labels: [],
      series: [],
      legend: {
        show: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: false
            }
          }
        }
      }
    };
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // ngAfterViewInit(): void {
  //   // Initialize map after view is ready with longer delay
  //   setTimeout(() => {
  //     this.initializeMap();
  //   }, 1500);
  // }

  loadDashboardData(): void {
    this.loading = true;

    // Load Tenants count
    this.tenantService.listTenants({ limit: 1, offset: 0 }).subscribe({
      next: (response) => {
        this.totalTenants = response.totalCount;
      },
      error: (err) => console.error('Error loading tenants:', err)
    });

    // Load Users count
    this.userService.listUsers({ limit: 1, offset: 0 }).subscribe({
      next: (response) => {
        this.totalUsers = response.totalCount;
      },
      error: (err) => console.error('Error loading users:', err)
    });

    // Load Gateways count and active/inactive stats
    this.gatewayService.listGateways({ limit: 1000, offset: 0 }).subscribe({
      next: (response) => {
        this.totalGateways = response.totalCount;

        // Calculate active/inactive gateways based on lastSeenAt
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        this.activeGateways = response.result.filter((gw: GatewayListItem) => {
          if (!gw.lastSeenAt) return false;
          const lastSeen = new Date(gw.lastSeenAt);
          return lastSeen > fiveMinutesAgo;
        }).length;

        this.inactiveGateways = this.totalGateways - this.activeGateways;

        // Update Active Gateways chart
        this.chartOptions_2 = {
          ...this.chartOptions_2,
          series: [this.activeGateways, this.inactiveGateways]
        };

        // Extract gateway locations for map (commented out for now)
        // this.gatewayLocations = response.result
        //   .filter((gw: GatewayListItem) => gw.location && gw.location.latitude && gw.location.longitude)
        //   .map((gw: GatewayListItem) => ({
        //     lat: gw.location!.latitude,
        //     lng: gw.location!.longitude,
        //     name: gw.name
        //   }));

        console.log('✅ Gateway stats:', {
          total: this.totalGateways,
          active: this.activeGateways,
          inactive: this.inactiveGateways
          // locationsFound: this.gatewayLocations.length
        });

        // Update map with gateway locations
        // this.updateMapMarkers();
      },
      error: (err) => {
        console.error('Error loading gateways:', err);
      }
    });

    // Load Devices count and active/inactive stats
    this.deviceService.listDevices({ limit: 1000, offset: 0 }).subscribe({
      next: (response) => {
        this.totalDevices = response.totalCount;

        // Calculate active/inactive devices based on lastSeenAt
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        this.activeDevices = response.result.filter((dev: DeviceListItem) => {
          if (!dev.lastSeenAt) return false;
          const lastSeen = new Date(dev.lastSeenAt);
          return lastSeen > oneHourAgo;
        }).length;

        this.inactiveDevices = this.totalDevices - this.activeDevices;

        // Update Active Devices chart
        this.chartOptions_1 = {
          ...this.chartOptions_1,
          series: [this.activeDevices, this.inactiveDevices]
        };

        console.log('✅ Device stats:', {
          total: this.totalDevices,
          active: this.activeDevices,
          inactive: this.inactiveDevices
        });

        // Load device data-rate usage for first 10 devices
        this.loadDeviceDataRates(response.result.slice(0, 10));

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading devices:', err);
        this.loading = false;
      }
    });
  }

  loadDeviceDataRates(devices: DeviceListItem[]): void {
    // For each device, get metrics and extract data-rate usage
    const dataRates: { [key: string]: number } = {};
    let processedCount = 0;

    if (devices.length === 0) {
      console.log('⚠️ No devices to load metrics for');
      return;
    }

    devices.forEach((device) => {
      // Get last 24 hours of data
      const end = new Date();
      const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

      const request = {
        devEui: device.devEui,
        start: start.toISOString(),
        end: end.toISOString(),
        aggregation: 'HOUR'
      };

      this.deviceService.getDeviceMetrics(request).subscribe({
        next: (response) => {
          processedCount++;

          // Extract data rate usage from metrics
          if (response.metrics && response.metrics.rxPacketsPerDr) {
            Object.keys(response.metrics.rxPacketsPerDr).forEach(dr => {
              dataRates[dr] = (dataRates[dr] || 0) + response.metrics.rxPacketsPerDr[dr];
            });
          }

          // Update chart after processing all devices
          if (processedCount === devices.length && Object.keys(dataRates).length > 0) {
            const sortedDRs = Object.keys(dataRates).sort();
            this.totalDataRatePackets = Object.values(dataRates).reduce((sum, val) => sum + val, 0);

            // Update labels and values for display
            this.dataRateLabels = sortedDRs;
            this.dataRateValues = sortedDRs.map(dr => dataRates[dr]);

            // Update donut chart
            this.chartOptions_3 = {
              ...this.chartOptions_3,
              series: this.dataRateValues,
              labels: this.dataRateLabels
            };

            console.log('✅ Device data-rate usage:', dataRates);
          } else if (processedCount === devices.length && Object.keys(dataRates).length === 0) {
            console.log('⚠️ No data-rate metrics found for devices');
          }
        },
        error: (err) => {
          processedCount++;
          console.error('Error loading device metrics for', device.devEui, ':', err);
        }
      });
    });
  }

  // Map functions commented out for now
  // initializeMap(): void {
  //   const mapElement = document.getElementById('gatewayMap');
  //   if (!mapElement) {
  //     console.log('⚠️ Map element not found');
  //     return;
  //   }

  //   try {
  //     // Initialize map centered on default location
  //     this.map = L.map('gatewayMap', {
  //       center: [20.5937, 78.9629],
  //       zoom: 5,
  //       zoomControl: true,
  //       attributionControl: true
  //     });

  //     // Add OpenStreetMap tiles with maxZoom
  //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //       attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //       maxZoom: 19,
  //       minZoom: 2
  //     }).addTo(this.map);

  //     console.log('✅ Map initialized successfully');

  //     // Force map to resize properly after initialization
  //     setTimeout(() => {
  //       if (this.map) {
  //         this.map.invalidateSize();
  //         console.log('✅ Map resized');

  //         // Add markers after resize
  //         this.updateMapMarkers();
  //       }
  //     }, 300);
  //   } catch (error) {
  //     console.error('❌ Map initialization error:', error);
  //   }
  // }

  // updateMapMarkers(): void {
  //   if (!this.map) {
  //     console.log('⚠️ Map not initialized yet');
  //     return;
  //   }

  //   // Clear existing markers
  //   this.map.eachLayer((layer) => {
  //     if (layer instanceof L.Marker) {
  //       this.map?.removeLayer(layer);
  //     }
  //   });

  //   // Add markers for each gateway
  //   if (this.gatewayLocations.length > 0) {
  //     const bounds: L.LatLngBoundsExpression = [];

  //     this.gatewayLocations.forEach(location => {
  //       const marker = L.marker([location.lat, location.lng])
  //         .addTo(this.map!)
  //         .bindPopup(`<b>${location.name}</b><br>Lat: ${location.lat.toFixed(4)}<br>Lng: ${location.lng.toFixed(4)}`);

  //       bounds.push([location.lat, location.lng]);
  //     });

  //     // Fit map to show all markers
  //     if (bounds.length > 0) {
  //       this.map.fitBounds(bounds, { padding: [50, 50] });
  //     }

  //     console.log('✅ Map updated with', this.gatewayLocations.length, 'markers');
  //   }
  // }

  get cards() {
    return [
      {
        background: 'bg-c-blue',
        title: 'Total Tenants',
        icon: 'icon-home',
        text: 'Active Tenants',
        number: this.totalTenants.toString(),
        no: this.loading ? '...' : this.totalTenants.toString()
      },
      {
        background: 'bg-c-green',
        title: 'Total Users',
        icon: 'icon-user',
        text: 'Registered Users',
        number: this.totalUsers.toString(),
        no: this.loading ? '...' : this.totalUsers.toString()
      },
      {
        background: 'bg-c-yellow',
        title: 'Total Gateways',
        icon: 'icon-radio',
        text: 'Connected Gateways',
        number: this.totalGateways.toString(),
        no: this.loading ? '...' : this.totalGateways.toString()
      },
      {
        background: 'bg-c-red',
        title: 'Total Applications',
        icon: 'icon-layers',
        text: 'Active Applications',
        number: this.totalApplications.toString(),
        no: this.loading ? '...' : this.totalApplications.toString()
      }
    ];
  }

  images = [
    {
      src: 'assets/images/gallery-grid/img-grd-gal-1.jpg',
      title: 'Old Scooter',
      size: 'PNG-100KB'
    },
    {
      src: 'assets/images/gallery-grid/img-grd-gal-2.jpg',
      title: 'Wall Art',
      size: 'PNG-150KB'
    },
    {
      src: 'assets/images/gallery-grid/img-grd-gal-3.jpg',
      title: 'Microphone',
      size: 'PNG-150KB'
    }
  ];
}
