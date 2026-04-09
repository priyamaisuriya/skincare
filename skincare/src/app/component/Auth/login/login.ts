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
  message: string = '';
  messageType: 'success' | 'danger' | '' = '';

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

        // Detect user object from response (consistent with AuthService logic)
        let user = response.user;
        if (!user && response.data) {
          user = (response.data.name || response.data.email) ? response.data : response.data.user;
        }

        if (user && user.type && user.type.toLowerCase() === 'admin') {
          this.message = 'Successful Admin';
          this.messageType = 'success';
          alert(' Admin Login successfully');
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']); // Navigate to admin dashboard
          }, 1500);
        } else {
          this.message = 'Invalid';
          this.messageType = 'danger';
          this.authService.logout(); // Clear token/user if it was a customer
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.message = 'Invalid';
        this.messageType = 'danger';
      }
    });
  }
}

