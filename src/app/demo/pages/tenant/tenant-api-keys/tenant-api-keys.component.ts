// angular import
import { Component } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-tenant-api-keys',
  imports: [SharedModule],
  templateUrl: './tenant-api-keys.component.html',
  styleUrls: ['./tenant-api-keys.component.scss']
})
export class TenantApiKeysComponent {}

