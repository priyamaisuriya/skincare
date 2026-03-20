import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../service/auth';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
  providers: [AuthService],
})
export class ChangePasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  errors: string[] = [];
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      current_password: ['', [Validators.required]],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    const newPassword = g.get('new_password')?.value;
    const confirmPassword = g.get('confirm_password')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  updatePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errors = [];
    this.successMessage = '';
    this.errorMessage = '';

    // Here we would call the auth service to update the password
    // For now, let's assume there's a changePassword method we're about to add
    const data = {
      current_password: this.passwordForm.value.current_password,
      new_password: this.passwordForm.value.new_password,
      new_password_confirmation: this.passwordForm.value.confirm_password
    };

    // Note: I will add this method to AuthService in the next step
    this.authService.updateAdminPassword(data).subscribe({
      next: (response: any) => {
        if ((window as any).iziToast) {
          (window as any).iziToast.success({
            title: 'Success!',
            message: 'Password updated successfully!',
            position: 'topRight'
          });
        }
        this.successMessage = 'Password updated successfully!';
        this.passwordForm.reset();
        this.submitting = false;
      },
      error: (err: any) => {
        if ((window as any).iziToast) {
          (window as any).iziToast.error({
            title: 'Error!',
            message: err.error.message || 'Failed to update password',
            position: 'topRight'
          });
        }
        this.errorMessage = err.error.message || 'Failed to update password';
        if (err.error.errors) {
          this.errors = Object.values(err.error.errors).flat() as string[];
        }
        this.submitting = false;
      }
    });
  }
}
