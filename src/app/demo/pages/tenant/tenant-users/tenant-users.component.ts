// angular import
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TenantService } from 'src/app/core/services/tenant.service';
import { TenantContextService } from 'src/app/core/services/tenant-context.service';
import { TenantUser, AddTenantUserRequest, UpdateTenantUserRequest } from 'src/app/core/models/tenant.model';

@Component({
  selector: 'app-tenant-users',
  imports: [SharedModule, CommonModule, FormsModule],
  templateUrl: './tenant-users.component.html',
  styleUrls: ['./tenant-users.component.scss']
})
export class TenantUsersComponent implements OnInit {
  private tenantService = inject(TenantService);
  private tenantContextService = inject(TenantContextService);

  tenantUsers: TenantUser[] = [];
  totalCount = 0;
  loading = false;
  error: string | null = null;
  selectedTenantId: string | null = null;
  selectedTenantName: string | null = null;
  showAddForm = false;

  // Form model for adding user
  newUserEmail = '';
  newUserIsAdmin = false;
  newUserIsDeviceAdmin = false;
  newUserIsGatewayAdmin = false;

  ngOnInit(): void {
    // Subscribe to selected tenant changes
    this.tenantContextService.selectedTenant$.subscribe(tenant => {
      this.selectedTenantId = tenant?.id || null;
      this.selectedTenantName = tenant?.name || null;

      if (this.selectedTenantId) {
        this.loadTenantUsers();
      } else {
        this.tenantUsers = [];
        this.totalCount = 0;
      }
    });
  }

  loadTenantUsers(): void {
    if (!this.selectedTenantId) {
      this.error = 'Please select a tenant first';
      return;
    }

    this.loading = true;
    this.error = null;

    this.tenantService.listTenantUsers(this.selectedTenantId, 100, 0).subscribe({
      next: (response) => {
        this.tenantUsers = response.result;
        this.totalCount = response.totalCount;
        this.loading = false;
        console.log('✅ Loaded tenant users:', this.totalCount);
      },
      error: (err) => {
        this.error = 'Failed to load tenant users: ' + err.message;
        this.loading = false;
        console.error('Error loading tenant users:', err);
      }
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newUserEmail = '';
    this.newUserIsAdmin = false;
    this.newUserIsDeviceAdmin = false;
    this.newUserIsGatewayAdmin = false;
    this.error = null;
  }

  addTenantUser(): void {
    if (!this.selectedTenantId) {
      this.error = 'No tenant selected';
      return;
    }

    if (!this.newUserEmail) {
      this.error = 'Email is required';
      return;
    }

    this.loading = true;
    this.error = null;

    const request: AddTenantUserRequest = {
      tenantUser: {
        tenantId: this.selectedTenantId,
        userId: this.newUserEmail, // Use email as userId for now
        isAdmin: this.newUserIsAdmin,
        isDeviceAdmin: this.newUserIsDeviceAdmin,
        isGatewayAdmin: this.newUserIsGatewayAdmin
      }
    };

    this.tenantService.addTenantUser(request).subscribe({
      next: () => {
        console.log('✅ User added to tenant successfully');
        this.showAddForm = false;
        this.resetForm();
        this.loadTenantUsers();
      },
      error: (err) => {
        this.error = 'Failed to add user to tenant: ' + err.message;
        this.loading = false;
        console.error('Error adding user to tenant:', err);
      }
    });
  }

  updateTenantUser(user: TenantUser): void {
    if (!this.selectedTenantId) {
      return;
    }

    const request: UpdateTenantUserRequest = {
      tenantUser: {
        tenantId: user.tenantId,
        userId: user.userId,
        isAdmin: user.isAdmin,
        isDeviceAdmin: user.isDeviceAdmin,
        isGatewayAdmin: user.isGatewayAdmin
      }
    };

    this.tenantService.updateTenantUser(request).subscribe({
      next: () => {
        console.log('✅ Tenant user updated successfully');
        this.loadTenantUsers();
      },
      error: (err) => {
        this.error = 'Failed to update tenant user: ' + err.message;
        console.error('Error updating tenant user:', err);
      }
    });
  }

  deleteTenantUser(userId: string, email: string): void {
    if (!this.selectedTenantId) {
      return;
    }

    if (confirm(`Are you sure you want to remove user "${email}" from this tenant?`)) {
      this.tenantService.deleteTenantUser(this.selectedTenantId, userId).subscribe({
        next: () => {
          console.log('✅ User removed from tenant successfully');
          this.loadTenantUsers();
        },
        error: (err) => {
          this.error = 'Failed to remove user from tenant: ' + err.message;
          console.error('Error removing user from tenant:', err);
        }
      });
    }
  }
}

