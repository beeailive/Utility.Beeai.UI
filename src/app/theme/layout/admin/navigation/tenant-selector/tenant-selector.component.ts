import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TenantService } from 'src/app/core/services/tenant.service';
import { TenantContextService, SelectedTenant } from 'src/app/core/services/tenant-context.service';
import { TenantListItem } from 'src/app/core/models/tenant.model';

@Component({
  selector: 'app-tenant-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tenant-selector.component.html',
  styleUrls: ['./tenant-selector.component.scss']
})
export class TenantSelectorComponent implements OnInit {
  private tenantService = inject(TenantService);
  private tenantContextService = inject(TenantContextService);

  tenants: TenantListItem[] = [];
  selectedTenantId: string | null = null;
  loading = false;
  isOpen = false;
  searchQuery = '';

  ngOnInit(): void {
    this.loadTenants();

    // Subscribe to selected tenant changes
    this.tenantContextService.selectedTenant$.subscribe(tenant => {
      this.selectedTenantId = tenant?.id || null;

      // If a new tenant is selected and it's not in the list, reload tenants
      if (tenant && !this.tenants.find(t => t.id === tenant.id)) {
        console.log('🔄 New tenant detected, reloading tenant list...');
        this.loadTenants();
      }
    });
  }

  loadTenants(): void {
    // Check if user is authenticated
    const authToken = localStorage.getItem('auth_token');
    if (!authToken) {
      console.warn('No auth token found. Please login first.');
      this.loading = false;
      return;
    }

    this.loading = true;
    this.tenantService.listTenants({ limit: 100, offset: 0 }).subscribe({
      next: (response) => {
        this.tenants = response.result;
        this.loading = false;

        // Auto-select first tenant if no tenant is selected
        if (this.tenants.length > 0 && !this.selectedTenantId) {
          const firstTenant = this.tenants[0];
          this.selectTenant(firstTenant);
        }
      },
      error: (err) => {
        console.error('Error loading tenants:', err);
        this.loading = false;
        // Don't show error in UI for tenant selector
      }
    });
  }

  get filteredTenants(): TenantListItem[] {
    if (!this.searchQuery) {
      return this.tenants;
    }
    return this.tenants.filter(t => 
      t.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get selectedTenantName(): string {
    if (!this.selectedTenantId) {
      return 'Select Tenant';
    }
    const tenant = this.tenants.find(t => t.id === this.selectedTenantId);
    return tenant?.name || 'Select Tenant';
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchQuery = '';
    }
  }

  selectTenant(tenant: TenantListItem): void {
    const selectedTenant: SelectedTenant = {
      id: tenant.id,
      name: tenant.name
    };
    this.tenantContextService.setSelectedTenant(selectedTenant);
    this.isOpen = false;
    this.searchQuery = '';
  }
}

