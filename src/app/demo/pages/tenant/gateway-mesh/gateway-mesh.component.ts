// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gateway-mesh',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gateway-mesh.component.html',
  styleUrls: ['./gateway-mesh.component.scss']
})
export class GatewayMeshComponent {}

