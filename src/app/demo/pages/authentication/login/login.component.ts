// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// project import
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Please enter email and password';
      return;
    }

    this.loading = true;
    this.error = null;

    // For now, using static token (you can implement actual login API later)
    const staticToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjgwMmFhOTNiLWY4ZDItNDZkMC1iNmE2LTk2MDYzY2Q1ODI3YSIsInR5cCI6ImtleSJ9.lzeF2I5fqQgytgiM4hxDpdw1IKsQXwaykhHnF9M8350';
    
    // Simulate API call
    setTimeout(() => {
      this.authService.setToken(staticToken);
      this.loading = false;
      console.log('✅ Login successful');
      this.router.navigate(['/dashboard']);
    }, 1000);
  }
}

