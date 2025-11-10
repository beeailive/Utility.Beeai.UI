// angular import
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService } from 'src/app/core/services/user.service';
import { UserListItem, User, CreateUserRequest } from 'src/app/core/models/user.model';
import { TenantContextService } from 'src/app/core/services/tenant-context.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-users',
  imports: [SharedModule, CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private tenantContextService = inject(TenantContextService);
  private toastService = inject(ToastService);

  users: UserListItem[] = [];
  totalCount = 0;
  loading = false;
  error: string | null = null;
  showCreateForm = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];

  newUser: User = {
    id: '',
    email: '',
    note: '',
    isAdmin: false,
    isActive: true
  };
  newUserPassword = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    const offset = (this.currentPage - 1) * this.pageSize;

    this.userService.listUsers({ limit: this.pageSize, offset }).subscribe({
      next: (response) => {
        this.users = response.result;
        this.totalCount = response.totalCount;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users: ' + err.message;
        this.loading = false;
        this.toastService.error('Error', 'Failed to load users: ' + err.message);
        console.error('Error loading users:', err);
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newUser = {
      id: '',
      email: '',
      note: '',
      isAdmin: false,
      isActive: true
    };
    this.newUserPassword = '';
    this.error = null;
  }

  createUser(): void {
    if (!this.newUser.email || !this.newUserPassword) {
      this.error = 'Email and password are required';
      this.toastService.warning('Validation Error', 'Email and password are required');
      return;
    }

    this.loading = true;
    this.error = null;

    // Get selected tenant
    const selectedTenant = this.tenantContextService.getSelectedTenant();

    const request: CreateUserRequest = {
      user: this.newUser,
      password: this.newUserPassword,
      tenants: selectedTenant ? [{
        tenantId: selectedTenant.id,
        isAdmin: false,
        isDeviceAdmin: false,
        isGatewayAdmin: false
      }] : []
    };

    console.log('Creating user with tenant assignment:', request);

    this.userService.createUser(request).subscribe({
      next: (response) => {
        console.log('✅ User created successfully:', response);
        if (selectedTenant) {
          console.log('✅ User assigned to tenant:', selectedTenant.name);
        }
        this.loading = false;
        this.showCreateForm = false;
        this.resetForm();
        this.toastService.success('Success', `User "${this.newUser.email}" created successfully!`);
        this.loadUsers();
      },
      error: (err) => {
        this.error = 'Failed to create user: ' + err.message;
        this.loading = false;
        this.toastService.error('Error', 'Failed to create user: ' + err.message);
        console.error('Error creating user:', err);
      }
    });
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.toastService.success('Success', 'User deleted successfully!');
          this.loadUsers();
        },
        error: (err) => {
          this.error = 'Failed to delete user: ' + err.message;
          this.toastService.error('Error', 'Failed to delete user: ' + err.message);
          console.error('Error deleting user:', err);
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
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

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
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  changePageSize(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1; // Reset to first page
    this.loadUsers();
  }

  // Helper for template
  Math = Math;
}

