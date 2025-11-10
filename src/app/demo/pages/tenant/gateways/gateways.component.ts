// angular import
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { GatewayService } from 'src/app/core/services/gateway.service';
import { GatewayListItem } from 'src/app/core/models/gateway.model';
import { TenantContextService } from 'src/app/core/services/tenant-context.service';

@Component({
  selector: 'app-gateways',
  imports: [SharedModule, CommonModule],
  templateUrl: './gateways.component.html',
  styleUrls: ['./gateways.component.scss']
})
export class GatewaysComponent implements OnInit, OnDestroy {
  private gatewayService = inject(GatewayService);
  private tenantContextService = inject(TenantContextService);
  private router = inject(Router);
  private tenantSubscription?: Subscription;

  gateways: GatewayListItem[] = [];
  totalCount = 0;
  loading = false;
  error: string | null = null;
  selectedTenantId: string | null = null;

  ngOnInit(): void {
    // Subscribe to tenant changes
    this.tenantSubscription = this.tenantContextService.selectedTenant$.subscribe(tenant => {
      this.selectedTenantId = tenant?.id || null;
      this.loadGateways();
    });
  }

  ngOnDestroy(): void {
    this.tenantSubscription?.unsubscribe();
  }

  loadGateways(): void {
    this.loading = true;
    this.error = null;

    const request: any = { limit: 100, offset: 0 };
    if (this.selectedTenantId) {
      request.tenantId = this.selectedTenantId;
    }

    this.gatewayService.listGateways(request).subscribe({
      next: (response) => {
        this.gateways = response.result;
        this.totalCount = response.totalCount;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load gateways: ' + err.message;
        this.loading = false;
        console.error('Error loading gateways:', err);
      }
    });
  }

  viewGateway(gatewayId: string): void {
    this.router.navigate(['/gateways', gatewayId]);
  }

  deleteGateway(gatewayId: string): void {
    if (confirm('Are you sure you want to delete this gateway?')) {
      this.gatewayService.deleteGateway(gatewayId).subscribe({
        next: () => {
          this.loadGateways();
        },
        error: (err) => {
          this.error = 'Failed to delete gateway: ' + err.message;
          console.error('Error deleting gateway:', err);
        }
      });
    }
  }
}

