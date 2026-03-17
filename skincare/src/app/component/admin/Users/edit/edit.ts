import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../../service/user';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class UserEdit implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  userId: number = 0;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
      status: [true],
      phone_number: ['', Validators.required],
      address: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      dob: ['', Validators.required],
      type: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postal_code: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.userId = +idParam;

      this.usersService.getUserById(this.userId).subscribe({
        next: (response: any) => {
          const rootData = response.data || response;
          console.log('Loaded User Data:', rootData);


          this.userForm.patchValue({
            name: rootData.name,
            password: '',
            email: rootData.email,
            status: rootData.status == 1 || rootData.status == true,
            phone_number: rootData.phone_number,
            address: rootData.address,
            first_name: rootData.first_name,
            last_name: rootData.last_name,
            dob: rootData.dob,
            type: rootData.type ? rootData.type.toLowerCase() : '',
            city: rootData.city,
            state: rootData.state,
            postal_code: rootData.postal_code,
          });

          if (rootData.profile_image) {
            this.imagePreview = `http://127.0.0.1:8000/storage/${rootData.profile_image}`;
          }
        },
        error: (err: any) => {
          console.error('Error loading User:', err);
        }
      });
    } else {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveUser(): void {
    console.log('Attempting to save user...');
    this.userForm.markAllAsTouched();

    if (this.userForm.invalid) {
      console.warn('User form is invalid. Details:');
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        if (control?.invalid) {
          console.log(`- ${key}:`, control.errors);
        }
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', this.userForm.get('name')?.value || '');
    formData.append('email', this.userForm.get('email')?.value || '');

    const password = this.userForm.get('password')?.value;
    if (password) {
      formData.append('password', password);
    }

    // Using 'type' as the role/type field since 'role' was missing from HTML

    formData.append('status', this.userForm.get('status')?.value ? '1' : '0');
    formData.append('phone_number', this.userForm.get('phone_number')?.value || '');
    formData.append('address', this.userForm.get('address')?.value || '');
    formData.append('first_name', this.userForm.get('first_name')?.value || '');
    formData.append('last_name', this.userForm.get('last_name')?.value || '');
    formData.append('dob', this.userForm.get('dob')?.value || '');
    formData.append('type', this.userForm.get('type')?.value || '');
    formData.append('city', this.userForm.get('city')?.value || '');
    formData.append('state', this.userForm.get('state')?.value || '');
    formData.append('postal_code', this.userForm.get('postal_code')?.value || '');

    if (this.selectedFile) {
      formData.append('profile_image', this.selectedFile);
    }

    console.log('Form data prepared, sending to server...');

    const request = this.isEditMode
      ? this.usersService.updateUser(this.userId, formData)
      : this.usersService.createUser(formData);

    request.subscribe({
      next: (resp) => {
        console.log('User saved successfully:', resp);
        alert(this.isEditMode ? 'User updated successfully!' : 'User created successfully!');
        this.router.navigate(['/admin/user']);
      },
      error: (err: any) => {
        console.error('Error saving User:', err);
        alert('Failed to save user. Check console for error details.');
      }
    });
  }
}