import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.scss'
})
export class CreateUser {
userForm: FormGroup;
  showCreateForm = false;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      // Tenant
      name: ['', Validators.required],
      description: [''],
      maxGatewayCount: [null],
      maxDeviceCount: [null],
      canHaveGateways: [false],
      privateGatewaysUp: [false],
      privateGatewaysDown: [false],

      // User
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      isActive: [true],
      notes: [''],

      // Permissions
      isAdmin: [false],
      isTenantAdmin: [false],
      isGatewayAdmin: [false],
      isDeviceAdmin: [false]
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
      console.log('Form Submitted:', this.userForm.value);
      // API call here
      alert('Tenant + User Created!');
      this.toggleCreateForm();
    }
  }
}
