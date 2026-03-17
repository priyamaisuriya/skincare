import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    const payload = this.loginForm.value;
    this.authService.login(payload).subscribe({
      next: (response) => {
        console.log('Login component: Success response:', response);
        this.router.navigate(['/']); // Navigate to home or dashboard
      },
      error: (err) => {
        console.error('Login error:', err);
      }
    });
  }
}
