// Angular Import
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

// project import
import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';
import { ToastContainerComponent } from './theme/shared/components/toast/toast.component';
import { AuthService } from './core/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterModule, SpinnerComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  // life cycle event
  ngOnInit() {
   
    this.authService.setToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjY3NjBjNmUyLWE2YmItNGE2NS1hMmViLThhNzliNzdjYTQ1MyIsInR5cCI6ImtleSJ9.z24Ry0B0Hr6cf2OZO1H2nS9aNu7a1phHbYjAra60oOw");
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
