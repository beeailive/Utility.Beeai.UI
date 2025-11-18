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
   
    this.authService.setToken(environment.token);
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
