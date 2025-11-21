import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChirpstackService } from 'src/app/service/chirpstack.service';

@Component({
  selector: 'app-create-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.scss'
})
export class CreateUser {
  userForm: FormGroup;
  showCreateForm = false;
  private chirpstack = inject(ChirpstackService);
  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({

      email: ['', [Validators.required, Validators.email]],
      id: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      isActive: [true],
      isAdmin: [false],
      note: [''],
      maxDeviceCount: [0],
      maxGatewayCount: [0],
      Tanentname: ['', Validators.required],
      privateGatewaysUp: [false],
      canHaveGateways: [false],
      privateGatewaysDown: [false],
      isTenantAdmin: [false],
      isDeviceAdmin: [false],
      isGatewayAdmin: [false],
      tenantId: [null],
      description: ['']
      // Permissions



    });
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.userForm.reset({
        isActive: true,
        canHaveGateways: false,
        privateGatewaysUp: false,
        privateGatewaysDown: false
      });
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.chirpstack.Post('api/tenant/createtenant', this.userForm.value).subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (x: any) => {
          if (x.message === 'User registered successfully') {
            alert(x.message)
            this.toggleCreateForm();
          }
          else {
            alert(x.message)
          }

        },
        error: (error) => {
             alert(error)
          console.log(error)
        }
      });

    }
  }
}
