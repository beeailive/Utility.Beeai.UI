// angular import
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { GatewayService } from 'src/app/core/services/gateway.service';
import { GetGatewayResponse, GatewayStats } from 'src/app/core/models/gateway.model';

// 3rd party import
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-gateway-detail',
  imports: [SharedModule, CommonModule, NgApexchartsModule],
  templateUrl: './gateway-detail.component.html',
  styleUrls: ['./gateway-detail.component.scss']
})
export class GatewayDetailComponent implements OnInit, OnDestroy {
  private gatewayService = inject(GatewayService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private routeSubscription?: Subscription;

  gatewayId: string = '';
  gateway: GetGatewayResponse | null = null;
  loading = false;
  error: string | null = null;
  activeTab: string = 'dashboard';

  // Dashboard data
  stats: any = null;
  receivedData: any[] = [];
  transmittedData: any[] = [];
  receivedFrequencyData: any[] = [];
  transmittedFrequencyData: any[] = [];
  receivedDrData: any[] = [];
  transmittedDrData: any[] = [];
  txPacketsStatusData: any[] = [];

  // Chart options
  receivedChartOptions!: Partial<ApexOptions>;
  transmittedChartOptions!: Partial<ApexOptions>;
  receivedFreqChartOptions!: Partial<ApexOptions>;
  transmittedFreqChartOptions!: Partial<ApexOptions>;
  receivedDrChartOptions!: Partial<ApexOptions>;
  transmittedDrChartOptions!: Partial<ApexOptions>;
  txStatusChartOptions!: Partial<ApexOptions>;

  ngOnInit(): void {
    this.initializeCharts();
    this.routeSubscription = this.route.params.subscribe(params => {
      this.gatewayId = params['id'];
      if (this.gatewayId) {
        this.loadGatewayDetails();
        this.loadGatewayStats();
      }
    });
  }

  initializeCharts(): void {
    // Received packets chart
    this.receivedChartOptions = {
      chart: {
        type: 'area',
        height: 250,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      series: [{
        name: 'Received Packets',
        data: []
      }],
      xaxis: {
        type: 'datetime',
        categories: []
      },
      yaxis: {
        title: {
          text: 'Packets'
        }
      },
      colors: ['#4680ff'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      tooltip: {
        x: {
          format: 'dd MMM HH:mm'
        }
      }
    };

    // Transmitted packets chart
    this.transmittedChartOptions = {
      chart: {
        type: 'area',
        height: 250,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      series: [{
        name: 'Transmitted Packets',
        data: []
      }],
      xaxis: {
        type: 'datetime',
        categories: []
      },
      yaxis: {
        title: {
          text: 'Packets'
        }
      },
      colors: ['#2ed8b6'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      tooltip: {
        x: {
          format: 'dd MMM HH:mm'
        }
      }
    };

    // Received / frequency chart (bar chart)
    this.receivedFreqChartOptions = {
      chart: {
        type: 'bar',
        height: 250,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [],
      xaxis: {
        type: 'datetime',
        categories: []
      },
      yaxis: {
        title: {
          text: 'Packets'
        }
      },
      colors: ['#4680ff', '#2ed8b6', '#FFB64D'],
      legend: {
        position: 'top'
      }
    };

    // Transmitted / frequency chart (bar chart)
    this.transmittedFreqChartOptions = {
      chart: {
        type: 'bar',
        height: 250,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [],
      xaxis: {
        type: 'datetime',
        categories: []
      },
      yaxis: {
        title: {
          text: 'Packets'
        }
      },
      colors: ['#4680ff', '#2ed8b6', '#FFB64D'],
      legend: {
        position: 'top'
      }
    };

    // Received / DR chart (bar chart)
    this.receivedDrChartOptions = {
      chart: {
        type: 'bar',
        height: 250,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [],
      xaxis: {
        type: 'datetime',
        categories: []
      },
      yaxis: {
        title: {
          text: 'Packets'
        }
      },
      colors: ['#4680ff'],
      legend: {
        position: 'top'
      }
    };

    // Transmitted / DR chart (bar chart)
    this.transmittedDrChartOptions = {
      chart: {
        type: 'bar',
        height: 250,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [],
      xaxis: {
        type: 'datetime',
        categories: []
      },
      yaxis: {
        title: {
          text: 'Packets'
        }
      },
      colors: ['#2ed8b6'],
      legend: {
        position: 'top'
      }
    };

    // TX packets / status chart (bar chart)
    this.txStatusChartOptions = {
      chart: {
        type: 'bar',
        height: 250,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [],
      xaxis: {
        type: 'datetime',
        categories: []
      },
      yaxis: {
        title: {
          text: 'Packets'
        }
      },
      colors: ['#FFB64D'],
      legend: {
        position: 'top'
      }
    };
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  loadGatewayDetails(): void {
    this.loading = true;
    this.error = null;

    this.gatewayService.getGateway(this.gatewayId).subscribe({
      next: (response) => {
        this.gateway = response;
        this.loading = false;
        console.log('✅ Loaded gateway details:', this.gateway);
      },
      error: (err) => {
        this.error = 'Failed to load gateway details: ' + err.message;
        this.loading = false;
        console.error('Error loading gateway details:', err);
      }
    });
  }

  loadGatewayStats(): void {
    // Load stats for last 24 hours
    const end = new Date();
    const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

    const startStr = start.toISOString();
    const endStr = end.toISOString();

    // Note: ChirpStack gateway stats endpoint might be different
    // Trying with tenant ID in path
    this.gatewayService.getGatewayStats(this.gatewayId, startStr, endStr, 'HOUR').subscribe({
      next: (response) => {
        console.log('🔍 Raw gateway stats response:', response);
        this.stats = response.result || response;
        this.processStatsData();
        console.log('✅ Loaded gateway stats:', this.stats);
      },
      error: (err) => {
        console.error('❌ Error loading gateway stats:', err);
        console.error('❌ Error details:', err.error);
        console.warn('⚠️ Gateway stats API not available - endpoint might not exist in ChirpStack');

        // Set empty data so UI shows "No data available" instead of loading forever
        this.receivedData = [];
        this.transmittedData = [];
      }
    });
  }

  processStatsData(): void {
    if (!this.stats) {
      console.log('⚠️ No stats data to process');
      return;
    }

    console.log('📊 Processing gateway stats...');
    console.log('📊 Stats structure:', {
      hasRxPackets: !!this.stats.rxPackets,
      hasTxPackets: !!this.stats.txPackets,
      rxPacketsKeys: this.stats.rxPackets ? Object.keys(this.stats.rxPackets) : [],
      txPacketsKeys: this.stats.txPackets ? Object.keys(this.stats.txPackets) : [],
      rxPacketsSample: this.stats.rxPackets,
      txPacketsSample: this.stats.txPackets
    });

    // Helper function to extract data from metric object
    const extractMetricData = (metric: any) => {
      console.log('🔍 Extracting metric data:', metric);

      if (!metric || !metric.timestamps || !metric.datasets) {
        console.warn('⚠️ Missing timestamps or datasets:', {
          hasMetric: !!metric,
          hasTimestamps: metric?.timestamps,
          hasDatasets: metric?.datasets
        });
        return { timestamps: [], values: [] };
      }

      const timestamps = metric.timestamps.map((ts: string) => new Date(ts).getTime());

      // Get the first dataset's data (usually there's only one dataset)
      const values = metric.datasets && metric.datasets.length > 0
        ? metric.datasets[0].data || []
        : [];

      console.log('✅ Extracted data:', { timestampCount: timestamps.length, valueCount: values.length });
      return { timestamps, values };
    };

    // Check if stats is an array (old format) or object (new format)
    if (Array.isArray(this.stats)) {
      // Old format: array of stats
      const timestamps = this.stats.map(stat => new Date(stat.time).getTime());
      const receivedValues = this.stats.map(stat => stat.rxPacketsReceived || 0);
      const transmittedValues = this.stats.map(stat => stat.txPacketsEmitted || 0);

      // Update received chart
      this.receivedChartOptions = {
        ...this.receivedChartOptions,
        series: [{
          name: 'Received Packets',
          data: receivedValues
        }],
        xaxis: {
          ...this.receivedChartOptions.xaxis,
          categories: timestamps
        }
      };

      // Update transmitted chart
      this.transmittedChartOptions = {
        ...this.transmittedChartOptions,
        series: [{
          name: 'Transmitted Packets',
          data: transmittedValues
        }],
        xaxis: {
          ...this.transmittedChartOptions.xaxis,
          categories: timestamps
        }
      };

      // Store processed data for display
      this.receivedData = this.stats.map(stat => ({
        time: new Date(stat.time).toLocaleTimeString(),
        value: stat.rxPacketsReceived || 0
      }));

      this.transmittedData = this.stats.map(stat => ({
        time: new Date(stat.time).toLocaleTimeString(),
        value: stat.txPacketsEmitted || 0
      }));

      console.log('✅ Processed stats data (array format):', {
        receivedCount: receivedValues.length,
        transmittedCount: transmittedValues.length,
        totalReceived: receivedValues.reduce((a, b) => a + b, 0),
        totalTransmitted: transmittedValues.reduce((a, b) => a + b, 0),
        receivedDataLength: this.receivedData.length,
        transmittedDataLength: this.transmittedData.length
      });
    } else {
      // New format: object with rxPackets, txPackets properties (ChirpStack format)
      const receivedData = extractMetricData(this.stats.rxPackets);
      const transmittedData = extractMetricData(this.stats.txPackets);

      // Update received chart
      this.receivedChartOptions = {
        ...this.receivedChartOptions,
        series: [{
          name: 'Received Packets',
          data: receivedData.values
        }],
        xaxis: {
          ...this.receivedChartOptions.xaxis,
          categories: receivedData.timestamps
        }
      };

      // Update transmitted chart
      this.transmittedChartOptions = {
        ...this.transmittedChartOptions,
        series: [{
          name: 'Transmitted Packets',
          data: transmittedData.values
        }],
        xaxis: {
          ...this.transmittedChartOptions.xaxis,
          categories: transmittedData.timestamps
        }
      };

      // Store processed data for display
      this.receivedData = receivedData.timestamps.map((ts: any, idx: number) => ({
        time: new Date(ts).toLocaleTimeString(),
        value: receivedData.values[idx] || 0
      }));

      this.transmittedData = transmittedData.timestamps.map((ts: any, idx: number) => ({
        time: new Date(ts).toLocaleTimeString(),
        value: transmittedData.values[idx] || 0
      }));

      // Process frequency charts (multiple datasets)
      if (this.stats.rxPacketsPerFreq) {
        const freqData = this.processMultiDatasetMetric(this.stats.rxPacketsPerFreq);
        this.receivedFreqChartOptions = {
          ...this.receivedFreqChartOptions,
          series: freqData.series,
          xaxis: {
            ...this.receivedFreqChartOptions.xaxis,
            categories: freqData.timestamps
          }
        };
        this.receivedFrequencyData = freqData.series.length > 0 ? [{ hasData: true }] : [];
      }

      if (this.stats.txPacketsPerFreq) {
        const freqData = this.processMultiDatasetMetric(this.stats.txPacketsPerFreq);
        this.transmittedFreqChartOptions = {
          ...this.transmittedFreqChartOptions,
          series: freqData.series,
          xaxis: {
            ...this.transmittedFreqChartOptions.xaxis,
            categories: freqData.timestamps
          }
        };
        this.transmittedFrequencyData = freqData.series.length > 0 ? [{ hasData: true }] : [];
      }

      // Process DR charts
      if (this.stats.rxPacketsPerDr) {
        const drData = this.processMultiDatasetMetric(this.stats.rxPacketsPerDr);
        this.receivedDrChartOptions = {
          ...this.receivedDrChartOptions,
          series: drData.series,
          xaxis: {
            ...this.receivedDrChartOptions.xaxis,
            categories: drData.timestamps
          }
        };
        this.receivedDrData = drData.series.length > 0 ? [{ hasData: true }] : [];
      }

      if (this.stats.txPacketsPerDr) {
        const drData = this.processMultiDatasetMetric(this.stats.txPacketsPerDr);
        this.transmittedDrChartOptions = {
          ...this.transmittedDrChartOptions,
          series: drData.series,
          xaxis: {
            ...this.transmittedDrChartOptions.xaxis,
            categories: drData.timestamps
          }
        };
        this.transmittedDrData = drData.series.length > 0 ? [{ hasData: true }] : [];
      }

      // Process TX status chart
      if (this.stats.txPacketsPerStatus) {
        const statusData = this.processMultiDatasetMetric(this.stats.txPacketsPerStatus);
        this.txStatusChartOptions = {
          ...this.txStatusChartOptions,
          series: statusData.series,
          xaxis: {
            ...this.txStatusChartOptions.xaxis,
            categories: statusData.timestamps
          }
        };
        this.txPacketsStatusData = statusData.series.length > 0 ? [{ hasData: true }] : [];
      }

      console.log('✅ Processed stats data (object format):', {
        receivedCount: receivedData.values.length,
        transmittedCount: transmittedData.values.length,
        totalReceived: receivedData.values.reduce((a: number, b: number) => a + b, 0),
        totalTransmitted: transmittedData.values.reduce((a: number, b: number) => a + b, 0),
        receivedDataLength: this.receivedData.length,
        transmittedDataLength: this.transmittedData.length,
        receivedFreqDataLength: this.receivedFrequencyData.length,
        transmittedFreqDataLength: this.transmittedFrequencyData.length,
        receivedDrDataLength: this.receivedDrData.length,
        transmittedDrDataLength: this.transmittedDrData.length,
        txStatusDataLength: this.txPacketsStatusData.length
      });
    }
  }

  // Helper function to process metrics with multiple datasets
  processMultiDatasetMetric(metric: any): { timestamps: number[], series: any[] } {
    if (!metric || !metric.timestamps || !metric.datasets) {
      return { timestamps: [], series: [] };
    }

    const timestamps = metric.timestamps.map((ts: string) => new Date(ts).getTime());
    const series = metric.datasets.map((dataset: any) => ({
      name: dataset.label || 'Data',
      data: dataset.data || []
    }));

    return { timestamps, series };
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/gateways']);
  }

  getRegionName(): string {
    // TODO: Map region ID to name
    return this.gateway?.gateway?.metadata?.['region'] || 'Unknown';
  }

  // Helper for template
  Object = Object;
}

