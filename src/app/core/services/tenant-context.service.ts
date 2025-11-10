import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SelectedTenant {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TenantContextService {
  private selectedTenantSubject = new BehaviorSubject<SelectedTenant | null>(null);
  public selectedTenant$: Observable<SelectedTenant | null> = this.selectedTenantSubject.asObservable();

  constructor() {
    // Load from localStorage if available
    const savedTenant = localStorage.getItem('selected_tenant');
    if (savedTenant) {
      try {
        this.selectedTenantSubject.next(JSON.parse(savedTenant));
      } catch (e) {
        console.error('Error parsing saved tenant:', e);
      }
    }
  }

  setSelectedTenant(tenant: SelectedTenant | null): void {
    this.selectedTenantSubject.next(tenant);
    if (tenant) {
      localStorage.setItem('selected_tenant', JSON.stringify(tenant));
    } else {
      localStorage.removeItem('selected_tenant');
    }
  }

  getSelectedTenant(): SelectedTenant | null {
    return this.selectedTenantSubject.value;
  }

  getSelectedTenantId(): string | null {
    return this.selectedTenantSubject.value?.id || null;
  }

  clearSelectedTenant(): void {
    this.setSelectedTenant(null);
  }
}

