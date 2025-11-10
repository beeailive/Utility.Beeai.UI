import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GatewayService } from '../../../core/services/gateway.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { RelayGatewayListItem, CreateRelayGatewayRequest, RelayGateway } from '../../../core/models/gateway.model';

@Component({
  selector: 'app-relay-gateways',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relay-gateways.component.html',
  styleUrls: ['./relay-gateways.component.scss']
})
export class RelayGatewaysComponent implements OnInit {
  private gatewayService = inject(GatewayService);
  private tenantContextService = inject(TenantContextService);
  private router = inject(Router);

  relayGateways: RelayGatewayListItem[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;

  // Add modal
  showAddModal = false;
  newRelayGateway: RelayGateway = {
    tenantId: '',
    relayId: '',
    name: '',
    description: '',
    statsInterval: 30,
    regionConfigId: ''
  };
  saving = false;

  ngOnInit(): void {
    this.loadRelayGateways();
  }

  loadRelayGateways(): void {
    const tenantId = this.tenantContextService.getSelectedTenantId();
    if (!tenantId) {
      this.error = 'No tenant selected';
      return;
    }

    this.loading = true;
    this.error = null;

    const request = {
      tenantId: tenantId,
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize
    };

    this.gatewayService.listRelayGateways(request).subscribe({
      next: (response) => {
        this.relayGateways = response.result || [];
        this.totalCount = response.totalCount || 0;
        this.loading = false;
        console.log('✅ Loaded relay gateways:', this.relayGateways);
      },
      error: (err) => {
        this.error = 'Failed to load relay gateways: ' + err.message;
        this.loading = false;
        console.error('Error loading relay gateways:', err);
      }
    });
  }

  openAddModal(): void {
    const tenantId = this.tenantContextService.getSelectedTenantId();
    if (!tenantId) {
      this.error = 'No tenant selected';
      return;
    }

    this.newRelayGateway = {
      tenantId: tenantId,
      relayId: '',
      name: '',
      description: '',
      statsInterval: 30,
      regionConfigId: ''
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.newRelayGateway = {
      tenantId: '',
      relayId: '',
      name: '',
      description: '',
      statsInterval: 30,
      regionConfigId: ''
    };
  }

  saveRelayGateway(): void {
    if (!this.newRelayGateway.relayId || !this.newRelayGateway.name) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.saving = true;
    this.error = null;

    const request: CreateRelayGatewayRequest = {
      relayGateway: this.newRelayGateway
    };

    this.gatewayService.createRelayGateway(
      this.newRelayGateway.tenantId,
      this.newRelayGateway.relayId,
      request
    ).subscribe({
      next: () => {
        console.log('✅ Relay gateway created successfully');
        this.saving = false;
        this.closeAddModal();
        this.loadRelayGateways();
      },
      error: (err) => {
        this.error = 'Failed to create relay gateway: ' + err.message;
        this.saving = false;
        console.error('Error creating relay gateway:', err);
      }
    });
  }

  deleteRelayGateway(relayGateway: RelayGatewayListItem): void {
    if (!confirm(`Are you sure you want to delete relay gateway "${relayGateway.name}"?`)) {
      return;
    }

    this.gatewayService.deleteRelayGateway(relayGateway.tenantId, relayGateway.relayId).subscribe({
      next: () => {
        console.log('✅ Relay gateway deleted successfully');
        this.loadRelayGateways();
      },
      error: (err) => {
        this.error = 'Failed to delete relay gateway: ' + err.message;
        console.error('Error deleting relay gateway:', err);
      }
    });
  }

  viewRelayGateway(relayGateway: RelayGatewayListItem): void {
    this.router.navigate(['/relay-gateways', relayGateway.tenantId, relayGateway.relayId]);
  }

  // Pagination methods
  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadRelayGateways();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadRelayGateways();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadRelayGateways();
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  // Helper for template
  Math = Math;
}

