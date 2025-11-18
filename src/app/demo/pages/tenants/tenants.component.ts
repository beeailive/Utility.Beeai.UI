// angular import
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TenantService } from 'src/app/core/services/tenant.service';
import { TenantListItem, Tenant } from 'src/app/core/models/tenant.model';
import { TenantContextService } from 'src/app/core/services/tenant-context.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-tenants',
  imports: [SharedModule, CommonModule, FormsModule],
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss']
})
export class TenantsComponent implements OnInit {
  private tenantService = inject(TenantService);
  private tenantContextService = inject(TenantContextService);
  private toastService = inject(ToastService);

  tenants: TenantListItem[] = [];
  totalCount = 0;
  loading = false;
  error: string | null = null;
  showCreateForm = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];

  // Form model
  newTenant: Tenant = {
    id: '',
    name: '',
    canHaveGateways: true,
    privateGatewaysUp: true,
    privateGatewaysDown: true,
    maxGatewayCount: 10,
    maxDeviceCount: 100
  };

  ngOnInit(): void {
    this.loadTenants();
  }

  loadTenants(): void {
    this.loading = true;
    this.error = null;

    const offset = (this.currentPage - 1) * this.pageSize;

    this.tenantService.listTenants({ limit: this.pageSize, offset }).subscribe({
      next: (response) => {
        this.tenants = response.result;
        this.totalCount = response.totalCount;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load tenants: ' + err.message;
        this.loading = false;
        this.toastService.error('Error', 'Failed to load tenants: ' + err.message);
        console.error('Error loading tenants:', err);
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (this.showCreateForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newTenant = {
      id: '',
      name: '',
      canHaveGateways: true,
      privateGatewaysUp: true,
      privateGatewaysDown: true,
      maxGatewayCount: 10,
      maxDeviceCount: 100
    };
  }

  createTenant(): void {
    this.loading = true;
    this.error = null;

    this.tenantService.createTenant({ tenant: this.newTenant }).subscribe({
      next: (response) => {
        console.log('Tenant created successfully:', response);

        // Automatically select the newly created tenant
        this.tenantContextService.setSelectedTenant({
          id: response.id,
          name: this.newTenant.name
        });

        console.log('✅ New tenant auto-selected:', response.id, this.newTenant.name);

        this.toastService.success('Success', `Tenant "${this.newTenant.name}" created successfully!`);
        this.showCreateForm = false;
        this.loadTenants();
        this.resetForm();
      },
      error: (err) => {
        this.error = 'Failed to create tenant: ' + err.message;
        this.loading = false;
        this.toastService.error('Error', 'Failed to create tenant: ' + err.message);
        console.error('Error creating tenant:', err);
      }
    });
  }

  deleteTenant(id: string): void {
    if (confirm('Are you sure you want to delete this tenant?')) {
      this.tenantService.deleteTenant(id).subscribe({
        next: () => {
          this.toastService.success('Success', 'Tenant deleted successfully!');
          this.loadTenants();
        },
        error: (err) => {
          this.error = 'Failed to delete tenant: ' + err.message;
          this.toastService.error('Error', 'Failed to delete tenant: ' + err.message);
          console.error('Error deleting tenant:', err);
        }
      });
    }
  }

  // Pagination methods
  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalCount);
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadTenants();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTenants();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTenants();
    }
  }

  changePageSize(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1; // Reset to first page
    this.loadTenants();
  }

  // Helper for template
  Math = Math;
}

