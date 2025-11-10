// angular import
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RegionService } from 'src/app/core/services/region.service';
import { RegionListItem } from 'src/app/core/models/region.model';

@Component({
  selector: 'app-regions',
  imports: [SharedModule, CommonModule, FormsModule],
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss']
})
export class RegionsComponent implements OnInit {
  private regionService = inject(RegionService);

  regions: RegionListItem[] = [];
  loading = false;
  error: string | null = null;
  totalCount = 0;

  ngOnInit(): void {
    this.loadRegions();
  }

  loadRegions(): void {
    this.loading = true;
    this.error = null;

    // ChirpStack v4 doesn't have a regions API endpoint
    // Regions are configured in chirpstack.toml configuration file
    // We'll try to load from API, but if it fails, show common regions
    this.regionService.listRegions({ limit: 100, offset: 0 }).subscribe({
      next: (response) => {
        this.regions = response.result;
        this.totalCount = response.totalCount;
        this.loading = false;
        console.log('✅ Loaded regions:', this.totalCount);
      },
      error: (err) => {
        // If API fails, show common LoRaWAN regions
        console.warn('Regions API not available, showing common regions:', err.message);
        this.regions = this.getCommonRegions();
        this.totalCount = this.regions.length;
        this.loading = false;
        this.error = null; // Don't show error, just use fallback
      }
    });
  }

  getCommonRegions(): RegionListItem[] {
    return [
      // {
      //   id: 'as923',
      //   name: 'AS923',
      //   description: 'Asia 923 MHz',
      //   region: 'as923'
      // },
      // {
      //   id: 'as923_2',
      //   name: 'AS923-2',
      //   description: 'Asia 923 MHz (alternative frequency)',
      //   region: 'as923_2'
      // },
      // {
      //   id: 'as923_3',
      //   name: 'AS923-3',
      //   description: 'Asia 923 MHz (alternative frequency)',
      //   region: 'as923_3'
      // },
      // {
      //   id: 'as923_4',
      //   name: 'AS923-4',
      //   description: 'Asia 923 MHz (alternative frequency)',
      //   region: 'as923_4'
      // },
      // {
      //   id: 'au915',
      //   name: 'AU915',
      //   description: 'Australia 915 MHz',
      //   region: 'au915'
      // },
      // {
      //   id: 'cn470',
      //   name: 'CN470',
      //   description: 'China 470 MHz',
      //   region: 'cn470'
      // },
      // {
      //   id: 'cn779',
      //   name: 'CN779',
      //   description: 'China 779 MHz',
      //   region: 'cn779'
      // },
      // {
      //   id: 'eu433',
      //   name: 'EU433',
      //   description: 'Europe 433 MHz',
      //   region: 'eu433'
      // },
      // {
      //   id: 'eu868',
      //   name: 'EU868',
      //   description: 'Europe 868 MHz',
      //   region: 'eu868'
      // },
      {
        id: 'in865',
        name: 'IN865',
        description: 'India 865 MHz',
        region: 'in865'
      },
      // {
      //   id: 'ism2400',
      //   name: 'ISM2400',
      //   description: 'ISM 2.4 GHz',
      //   region: 'ism2400'
      // },
      // {
      //   id: 'kr920',
      //   name: 'KR920',
      //   description: 'South Korea 920 MHz',
      //   region: 'kr920'
      // },
      // {
      //   id: 'ru864',
      //   name: 'RU864',
      //   description: 'Russia 864 MHz',
      //   region: 'ru864'
      // },
      // {
      //   id: 'us915',
      //   name: 'US915',
      //   description: 'United States 915 MHz',
      //   region: 'us915'
      // }
    ];
  }

  deleteRegion(id: string): void {
    if (!confirm('Are you sure you want to delete this region?')) {
      return;
    }

    this.regionService.deleteRegion(id).subscribe({
      next: () => {
        console.log('✅ Region deleted successfully');
        this.loadRegions();
      },
      error: (err) => {
        this.error = 'Failed to delete region: ' + err.message;
        console.error('Error deleting region:', err);
      }
    });
  }
}

