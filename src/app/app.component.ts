// Angular Import
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

// project import
import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';
import { ToastContainerComponent } from './theme/shared/components/toast/toast.component';
import { AuthService } from './core/services/auth.service';

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
    // Set static token for development (TEMPORARY - Remove in production)
    const staticToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjgwMmFhOTNiLWY4ZDItNDZkMC1iNmE2LTk2MDYzY2Q1ODI3YSIsInR5cCI6ImtleSJ9.lzeF2I5fqQgytgiM4hxDpdw1IKsQXwaykhHnF9M8350'; // Replace with your actual token
    this.authService.setToken(staticToken);
    console.log('Static token set for development');

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
