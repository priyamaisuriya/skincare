import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../../../service/profile';
import { AuthService } from '../../../../service/auth';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit implements OnInit {
  profileForm: FormGroup;
  user: any = null;
  successMessage: string = '';
  errors: string[] = [];
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      first_name: [''],
      last_name: [''],
      phone_number: [''],
      date_of_birth: [''],
      address: [''],
      city: [''],
      state: [''],
      postal_code: [''],
    });
  }

  ngOnInit(): void {
    // Initial load from auth state
    this.authService.currentUser$.subscribe(userData => {
      if (userData && !this.user) {
        this.user = userData;
        this.updateForm(userData);
      }
    });

    // Fetch fresh data from backend
    this.profileService.getProfile().subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.data) {
          this.user = response.data;
          this.authService.setUser(this.user);
          this.updateForm(this.user);
        }
      },
      error: (err) => console.error('Error fetching profile:', err)
    });
  }

  private updateForm(userData: any): void {
    this.profileForm.patchValue({
      name: userData.name,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone_number: userData.phone_number,
      date_of_birth: userData.date_of_birth || userData.dob,
      address: userData.address,
      city: userData.city,
      state: userData.state,
      postal_code: userData.postal_code,
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  get userImagePath(): string {
    if (this.user?.profile_image) {
      if (this.user.profile_image.startsWith('http')) return this.user.profile_image;
      return `http://127.0.0.1:8000/storage/${this.user.profile_image}`;
    }
    return 'assets/img/avatar/avatar-1.png';
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    const formData = new FormData();
    Object.keys(this.profileForm.controls).forEach(key => {
      formData.append(key, this.profileForm.get(key)?.value || '');
    });

    if (this.selectedFile) {
      formData.append('profile_image', this.selectedFile);
    }

    this.profileService.updateProfile(formData).subscribe({
      next: (response: any) => {
        this.successMessage = 'Profile updated successfully!';
        this.errors = [];
        // Update local auth user state with new data
        if (response.data) {
          this.authService.setUser(response.data);
        }
      },
      error: (err: any) => {
        this.successMessage = '';
        this.errors = err.error?.message ? [err.error.message] : ['Failed to update profile.'];
        if (err.error?.errors) {
            this.errors = Object.values(err.error.errors).flat() as string[];
        }
      }
    });
  }
}
