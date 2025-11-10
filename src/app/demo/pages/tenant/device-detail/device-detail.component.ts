import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedModule } from '../../../../theme/shared/shared.module';
import { DeviceService } from '../../../../core/services/device.service';
import { GetDeviceResponse, GetDeviceLinkMetricsResponse, DeviceLinkMetric } from '../../../../core/models/device.model';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-device-detail',
  imports: [SharedModule, CommonModule, FormsModule, RouterModule, NgApexchartsModule],
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.scss']
})
export class DeviceDetailComponent implements OnInit, OnDestroy {
  private deviceService = inject(DeviceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private routeSubscription?: Subscription;

  devEui: string = '';
  device: GetDeviceResponse | null = null;
  loading = false;
  error: string | null = null;
  activeTab: string = 'dashboard';
  activeMetricsTab: string = 'link-metrics'; // Sub-tab for Dashboard

  // Link metrics data
  linkMetrics: any = null;
  linkMetricsLoading = false;
  selectedTimeRange: string = '24h';

  // Device metrics data
  deviceMetrics: any = null;
  deviceMetricsLoading = false;
  deviceMetricsCharts: Map<string, any> = new Map();

  // OTAA keys data
  deviceKeys: any = null;
  deviceKeysLoading = false;
  deviceKeysError: string | null = null;

  // Activation data
  deviceActivation: any = null;
  deviceActivationLoading = false;
  deviceActivationError: string | null = null;

  // Queue data
  deviceQueue: any[] = [];
  deviceQueueLoading = false;
  deviceQueueError: string | null = null;

  // Events data
  deviceEvents: any[] = [];
  deviceEventsLoading = false;
  deviceEventsError: string | null = null;

  // LoRaWAN Frames data
  lorawanFrames: any[] = [];
  lorawanFramesLoading = false;
  lorawanFramesError: string | null = null;

  // Queue form
  queueItemForm = {
    confirmed: false,
    fPort: 1,
    data: '',
    isEncrypted: false,
    expiresAt: ''
  };
  queueDataFormat: 'hex' | 'base64' | 'json' = 'hex';
  enqueueing = false;
  enqueueError: string | null = null;
  enqueueSuccess: string | null = null;

  // Chart options
  receivedChartOptions: any = null;
  rssiChartOptions: any = null;
  snrChartOptions: any = null;
  receivedFreqChartOptions: any = null;
  receivedDrChartOptions: any = null;
  errorsChartOptions: any = null;

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.devEui = params['devEui'];
      if (this.devEui) {
        this.loadDeviceDetails();
        this.loadLinkMetrics();
        this.loadDeviceMetrics();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  loadDeviceDetails(): void {
    this.loading = true;
    this.error = null;

    this.deviceService.getDevice(this.devEui).subscribe({
      next: (response) => {
        this.device = response;
        this.loading = false;
        console.log('✅ Loaded device details:', this.device);
      },
      error: (err) => {
        this.error = 'Failed to load device details: ' + err.message;
        this.loading = false;
        console.error('Error loading device details:', err);
      }
    });
  }

  loadLinkMetrics(timeRange: string = '24h'): void {
    this.linkMetricsLoading = true;

    // Calculate time range
    const end = new Date();
    let start: Date;
    let aggregation: string;

    switch (timeRange) {
      case '24h':
        start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
        aggregation = 'HOUR';
        break;
      case '31d':
        start = new Date(end.getTime() - 31 * 24 * 60 * 60 * 1000);
        aggregation = 'DAY';
        break;
      case '1y':
        start = new Date(end.getTime() - 365 * 24 * 60 * 60 * 1000);
        aggregation = 'MONTH';
        break;
      default:
        start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
        aggregation = 'HOUR';
    }

    const request = {
      devEui: this.devEui,
      start: start.toISOString(),
      end: end.toISOString(),
      aggregation: aggregation
    };

    this.deviceService.getDeviceLinkMetrics(request).subscribe({
      next: (response) => {
        console.log('🔍 Raw link metrics response:', response);

        // Store the raw response (it's an object with rxPackets, gwRssi, etc.)
        this.linkMetrics = response;

        this.linkMetricsLoading = false;
        console.log('✅ Loaded link metrics:', this.linkMetrics);
        this.processLinkMetrics();
      },
      error: (err) => {
        this.linkMetricsLoading = false;
        console.error('❌ Error loading link metrics:', err);
      }
    });
  }

  selectTimeRange(range: string): void {
    this.selectedTimeRange = range;
    this.loadLinkMetrics(range);
  }

  refreshLinkMetrics(): void {
    this.loadLinkMetrics(this.selectedTimeRange);
  }

  loadDeviceMetrics(): void {
    this.deviceMetricsLoading = true;

    // Get last 24 hours of data
    const end = new Date();
    const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

    const request = {
      devEui: this.devEui,
      start: start.toISOString(),
      end: end.toISOString(),
      aggregation: 'HOUR'
    };

    this.deviceService.getDeviceMetrics(request).subscribe({
      next: (response: any) => {
        this.deviceMetrics = response;
        this.deviceMetricsLoading = false;
        console.log('✅ Loaded device metrics:', this.deviceMetrics);
        this.processDeviceMetrics();
      },
      error: (err) => {
        this.deviceMetricsLoading = false;
        console.error('Error loading device metrics:', err);
      }
    });
  }

  processLinkMetrics(): void {
    if (!this.linkMetrics) {
      console.log('⚠️ No link metrics data available');
      return;
    }

    console.log('📊 Processing link metrics...');

    // Helper function to extract data from metric object
    const extractMetricData = (metric: any) => {
      if (!metric || !metric.timestamps || !metric.datasets) {
        return { timestamps: [], values: [] };
      }

      const timestamps = metric.timestamps.map((ts: string) => new Date(ts).getTime());

      // Get the first dataset's data (usually there's only one dataset)
      const values = metric.datasets && metric.datasets.length > 0
        ? metric.datasets[0].data || []
        : [];

      return { timestamps, values };
    };

    // Extract data for each metric
    const rxPacketsData = extractMetricData(this.linkMetrics.rxPackets);
    const rssiData = extractMetricData(this.linkMetrics.gwRssi);
    const snrData = extractMetricData(this.linkMetrics.gwSnr);
    const errorsData = extractMetricData(this.linkMetrics.errors);

    console.log('📊 Chart data:', {
      rxPackets: rxPacketsData.values.length,
      rssi: rssiData.values.length,
      snr: snrData.values.length,
      errors: errorsData.values.length
    });

    // Received packets chart
    this.receivedChartOptions = {
      series: [{
        name: 'Received',
        data: rxPacketsData.values
      }],
      chart: {
        type: 'area',
        height: 250,
        toolbar: { show: false },
        animations: { enabled: true }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      colors: ['#4680ff'],
      xaxis: {
        type: 'datetime',
        categories: rxPacketsData.timestamps
      },
      yaxis: {
        title: { text: 'Packets' }
      },
      tooltip: {
        x: { format: 'dd MMM HH:mm' }
      }
    };

    // RSSI chart
    this.rssiChartOptions = {
      series: [{
        name: 'RSSI',
        data: rssiData.values
      }],
      chart: {
        type: 'area',
        height: 250,
        toolbar: { show: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      colors: ['#ff5370'],
      xaxis: {
        type: 'datetime',
        categories: rssiData.timestamps
      },
      yaxis: {
        title: { text: 'dBm' }
      },
      tooltip: {
        x: { format: 'dd MMM HH:mm' }
      }
    };

    // SNR chart
    this.snrChartOptions = {
      series: [{
        name: 'SNR',
        data: snrData.values
      }],
      chart: {
        type: 'area',
        height: 250,
        toolbar: { show: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      colors: ['#2ed8b6'],
      xaxis: {
        type: 'datetime',
        categories: snrData.timestamps
      },
      yaxis: {
        title: { text: 'dB' }
      },
      tooltip: {
        x: { format: 'dd MMM HH:mm' }
      }
    };

    // Errors chart
    this.errorsChartOptions = {
      series: [{
        name: 'Errors',
        data: errorsData.values
      }],
      chart: {
        type: 'area',
        height: 250,
        toolbar: { show: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      colors: ['#ffba57'],
      xaxis: {
        type: 'datetime',
        categories: errorsData.timestamps
      },
      yaxis: {
        title: { text: 'Count' }
      },
      tooltip: {
        x: { format: 'dd MMM HH:mm' }
      }
    };

    // Process frequency and DR data
    this.processFrequencyAndDrData();
  }

  processFrequencyAndDrData(): void {
    if (!this.linkMetrics) {
      return;
    }

    // Extract frequency data
    const freqData = extractMetricData(this.linkMetrics.rxPacketsPerFreq);
    const drData = extractMetricData(this.linkMetrics.rxPacketsPerDr);

    // Helper function to extract data from metric object
    function extractMetricData(metric: any) {
      if (!metric || !metric.timestamps || !metric.datasets) {
        return { labels: [], values: [] };
      }

      // For frequency/DR charts, we need to aggregate data differently
      // The datasets might have labels for different frequencies/DRs
      const aggregated = new Map<string, number>();

      metric.datasets.forEach((dataset: any) => {
        if (dataset.label && dataset.data) {
          const total = dataset.data.reduce((sum: number, val: number) => sum + val, 0);
          aggregated.set(dataset.label, (aggregated.get(dataset.label) || 0) + total);
        }
      });

      return {
        labels: Array.from(aggregated.keys()),
        values: Array.from(aggregated.values())
      };
    }

    // Received / frequency chart
    this.receivedFreqChartOptions = {
      series: [{
        name: 'Packets',
        data: freqData.values
      }],
      chart: {
        type: 'bar',
        height: 250,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%'
        }
      },
      dataLabels: { enabled: false },
      colors: ['#4680ff'],
      xaxis: {
        categories: freqData.labels,
        title: { text: 'Frequency (Hz)' }
      },
      yaxis: {
        title: { text: 'Packets' }
      }
    };

    // Received / DR chart
    this.receivedDrChartOptions = {
      series: [{
        name: 'Packets',
        data: drData.values
      }],
      chart: {
        type: 'bar',
        height: 250,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%'
        }
      },
      dataLabels: { enabled: false },
      colors: ['#2ed8b6'],
      xaxis: {
        categories: drData.labels,
        title: { text: 'Data Rate' }
      },
      yaxis: {
        title: { text: 'Packets' }
      }
    };

    console.log('✅ Processed frequency/DR charts:', {
      frequencies: freqData.labels.length,
      dataRates: drData.labels.length
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;

    // Load data for specific tabs when activated
    if (tab === 'otaa-keys' && !this.deviceKeys) {
      this.loadDeviceKeys();
    } else if (tab === 'activation' && !this.deviceActivation) {
      this.loadDeviceActivation();
    } else if (tab === 'queue' && this.deviceQueue.length === 0) {
      this.loadDeviceQueue();
    } else if (tab === 'events' && this.deviceEvents.length === 0) {
      this.loadDeviceEvents();
    } else if (tab === 'lorawan-frames' && this.lorawanFrames.length === 0) {
      this.loadLoRaWANFrames();
    }
  }

  setActiveMetricsTab(tab: string): void {
    this.activeMetricsTab = tab;
  }

  loadDeviceKeys(): void {
    this.deviceKeysLoading = true;
    this.deviceKeysError = null;

    this.deviceService.getDeviceKeys(this.devEui).subscribe({
      next: (response) => {
        this.deviceKeys = response;
        this.deviceKeysLoading = false;
        console.log('✅ Loaded device keys:', this.deviceKeys);
      },
      error: (err) => {
        this.deviceKeysError = 'Failed to load device keys: ' + err.message;
        this.deviceKeysLoading = false;
        console.error('Error loading device keys:', err);
      }
    });
  }

  loadDeviceActivation(): void {
    this.deviceActivationLoading = true;
    this.deviceActivationError = null;

    this.deviceService.getDeviceActivation(this.devEui).subscribe({
      next: (response) => {
        this.deviceActivation = response;
        this.deviceActivationLoading = false;
        console.log('✅ Loaded device activation:', this.deviceActivation);
      },
      error: (err) => {
        this.deviceActivationError = 'Failed to load device activation: ' + err.message;
        this.deviceActivationLoading = false;
        console.error('Error loading device activation:', err);
      }
    });
  }

  loadDeviceQueue(): void {
    this.deviceQueueLoading = true;
    this.deviceQueueError = null;

    this.deviceService.getDeviceQueue(this.devEui).subscribe({
      next: (response) => {
        this.deviceQueue = response.result || [];
        this.deviceQueueLoading = false;
        console.log('✅ Loaded device queue:', this.deviceQueue);
      },
      error: (err) => {
        this.deviceQueueError = 'Failed to load device queue: ' + err.message;
        this.deviceQueueLoading = false;
        console.error('Error loading device queue:', err);
      }
    });
  }

  loadDeviceEvents(): void {
    this.deviceEventsLoading = true;
    this.deviceEventsError = null;

    const request = {
      devEui: this.devEui,
      limit: 100
    };

    this.deviceService.listDeviceEvents(request).subscribe({
      next: (response) => {
        this.deviceEvents = response.result || [];
        this.deviceEventsLoading = false;
        console.log('✅ Loaded device events:', this.deviceEvents);
      },
      error: (err) => {
        this.deviceEventsError = 'Failed to load device events: ' + err.message;
        this.deviceEventsLoading = false;
        console.error('Error loading device events:', err);
      }
    });
  }

  loadLoRaWANFrames(): void {
    this.lorawanFramesLoading = true;
    this.lorawanFramesError = null;

    const request = {
      devEui: this.devEui,
      limit: 100
    };

    this.deviceService.listLoRaWANFrames(request).subscribe({
      next: (response) => {
        this.lorawanFrames = response.result || [];
        this.lorawanFramesLoading = false;
        console.log('✅ Loaded LoRaWAN frames:', this.lorawanFrames);
      },
      error: (err) => {
        this.lorawanFramesError = 'Failed to load LoRaWAN frames: ' + err.message;
        this.lorawanFramesLoading = false;
        console.error('Error loading LoRaWAN frames:', err);
      }
    });
  }

  enqueueItem(): void {
    this.enqueueing = true;
    this.enqueueError = null;
    this.enqueueSuccess = null;

    const request = {
      queueItem: {
        devEui: this.devEui,
        confirmed: this.queueItemForm.confirmed,
        data: this.queueItemForm.data,
        fPort: this.queueItemForm.fPort,
        object: this.queueDataFormat === 'json' ? JSON.parse(this.queueItemForm.data) : undefined
      }
    };

    this.deviceService.enqueueDeviceQueueItem(this.devEui, request).subscribe({
      next: (response) => {
        this.enqueueing = false;
        this.enqueueSuccess = 'Queue item added successfully!';
        console.log('✅ Enqueued item:', response);

        // Reset form
        this.queueItemForm = {
          confirmed: false,
          fPort: 1,
          data: '',
          isEncrypted: false,
          expiresAt: ''
        };

        // Reload queue
        this.loadDeviceQueue();

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.enqueueSuccess = null;
        }, 3000);
      },
      error: (err) => {
        this.enqueueError = 'Failed to enqueue item: ' + (err.error?.message || err.message);
        this.enqueueing = false;
        console.error('Error enqueueing item:', err);
      }
    });
  }

  reloadQueue(): void {
    this.deviceQueue = [];
    this.loadDeviceQueue();
  }

  flushQueue(): void {
    if (!confirm('Are you sure you want to flush the entire device queue?')) {
      return;
    }

    this.deviceService.flushDeviceQueue(this.devEui).subscribe({
      next: () => {
        console.log('✅ Queue flushed successfully');
        this.enqueueSuccess = 'Queue flushed successfully!';
        this.loadDeviceQueue();

        setTimeout(() => {
          this.enqueueSuccess = null;
        }, 3000);
      },
      error: (err) => {
        this.enqueueError = 'Failed to flush queue: ' + (err.error?.message || err.message);
        console.error('Error flushing queue:', err);
      }
    });
  }

  goBack(): void {
    // Navigate back to application detail page if we have applicationId
    if (this.device?.device?.applicationId) {
      this.router.navigate(['/applications', this.device.device.applicationId]);
    } else {
      // Fallback to applications list
      this.router.navigate(['/applications']);
    }
  }

  processDeviceMetrics(): void {
    if (!this.deviceMetrics || !this.deviceMetrics.metrics) {
      console.log('No device metrics data available');
      return;
    }

    // Process each metric and create charts
    const metrics = this.deviceMetrics.metrics;

    Object.keys(metrics).forEach(metricName => {
      const metricData = metrics[metricName];

      if (!metricData || !metricData.timestamps || !metricData.datasets) {
        return;
      }

      // Create chart for this metric
      const timestamps = metricData.timestamps.map((ts: string) => new Date(ts).getTime());

      // Get all dataset series
      const series = Object.keys(metricData.datasets).map(datasetName => ({
        name: datasetName,
        data: metricData.datasets[datasetName].data || []
      }));

      const chartOptions = {
        series: series,
        chart: {
          type: 'line',
          height: 250,
          toolbar: { show: false },
          animations: { enabled: true }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        colors: ['#4680ff', '#2ed8b6', '#ff5370', '#ffba57'],
        xaxis: {
          type: 'datetime',
          categories: timestamps
        },
        yaxis: {
          title: { text: metricData.unit || '' }
        },
        tooltip: {
          x: { format: 'dd MMM HH:mm' }
        },
        legend: {
          show: series.length > 1
        }
      };

      this.deviceMetricsCharts.set(metricName, chartOptions);
    });

    console.log('✅ Processed device metrics charts:', this.deviceMetricsCharts.size);
  }

  // Helper for template
  Object = Object;
  Array = Array;
}

