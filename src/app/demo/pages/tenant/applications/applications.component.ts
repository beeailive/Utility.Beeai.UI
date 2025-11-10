// angular import
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ApplicationService } from 'src/app/core/services/application.service';
import { ApplicationListItem } from 'src/app/core/models/application.model';
import { TenantContextService } from 'src/app/core/services/tenant-context.service';

@Component({
  selector: 'app-applications',
  imports: [SharedModule, CommonModule],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit, OnDestroy {
  private applicationService = inject(ApplicationService);
  private tenantContextService = inject(TenantContextService);
  private router = inject(Router);
  private tenantSubscription?: Subscription;

  applications: ApplicationListItem[] = [];
  totalCount = 0;
  loading = false;
  error: string | null = null;
  selectedTenantId: string | null = null;

  ngOnInit(): void {
    // Subscribe to tenant changes
    this.tenantSubscription = this.tenantContextService.selectedTenant$.subscribe(tenant => {
      this.selectedTenantId = tenant?.id || null;
      if (this.selectedTenantId) {
        this.loadApplications();
      } else {
        this.applications = [];
        this.totalCount = 0;
      }
    });
  }

  ngOnDestroy(): void {
    this.tenantSubscription?.unsubscribe();
  }

  loadApplications(): void {
    if (!this.selectedTenantId) {
      this.error = 'Please select a tenant first';
      return;
    }

    this.loading = true;
    this.error = null;

    this.applicationService.listApplications({ tenantId: this.selectedTenantId, limit: 100, offset: 0 }).subscribe({
      next: (response) => {
        this.applications = response.result;
        this.totalCount = response.totalCount;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load applications: ' + err.message;
        this.loading = false;
        console.error('Error loading applications:', err);
      }
    });
  }

  deleteApplication(id: string): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.applicationService.deleteApplication(id).subscribe({
        next: () => {
          this.loadApplications();
        },
        error: (err) => {
          this.error = 'Failed to delete application: ' + err.message;
          console.error('Error deleting application:', err);
        }
      });
    }
  }

  viewApplication(id: string): void {
    this.router.navigate(['/applications', id]);
  }
}

