import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  public toasts$ = this.toastSubject.asObservable();

  private toasts: Toast[] = [];

  /**
   * Show a success toast
   */
  success(title: string, message: string, duration: number = 3000): void {
    this.show('success', title, message, duration);
  }

  /**
   * Show an error toast
   */
  error(title: string, message: string, duration: number = 5000): void {
    this.show('error', title, message, duration);
  }

  /**
   * Show a warning toast
   */
  warning(title: string, message: string, duration: number = 4000): void {
    this.show('warning', title, message, duration);
  }

  /**
   * Show an info toast
   */
  info(title: string, message: string, duration: number = 3000): void {
    this.show('info', title, message, duration);
  }

  /**
   * Show a toast notification
   */
  private show(type: Toast['type'], title: string, message: string, duration: number): void {
    const toast: Toast = {
      id: this.generateId(),
      type,
      title,
      message,
      duration,
      timestamp: new Date()
    };

    this.toasts.push(toast);
    this.toastSubject.next(toast);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }
  }

  /**
   * Remove a toast by ID
   */
  remove(id: string): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  /**
   * Clear all toasts
   */
  clear(): void {
    this.toasts = [];
  }

  /**
   * Get all current toasts
   */
  getToasts(): Toast[] {
    return this.toasts;
  }

  /**
   * Generate unique ID for toast
   */
  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

