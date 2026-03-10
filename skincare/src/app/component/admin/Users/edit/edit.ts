import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../../service/user';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit implements OnInit {
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
      email: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      status: [false],
      phone_number: ['', Validators.required],
      address: ['', Validators.required],
      profile_image: [''],
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
            email: rootData.email,
            password: rootData.password,
            role: rootData.role,
            status: rootData.status == 1 || rootData.status == true,
            phone_number: rootData.phone_number,
            address: rootData.address,
            profile_image: rootData.profile_image,
            first_name: rootData.first_name,
            last_name: rootData.last_name,
            dob: rootData.dob,
            type: rootData.type,
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
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.userForm.value.name);
    formData.append('email', this.userForm.value.email);
    formData.append('password', this.userForm.value.password);
    formData.append('role', this.userForm.value.role);
    formData.append('status', this.userForm.value.status);
    formData.append('phone_number', this.userForm.value.phone_number);
    formData.append('address', this.userForm.value.address);
    formData.append('profile_image', this.userForm.value.profile_image);
    formData.append('first_name', this.userForm.value.first_name);
    formData.append('last_name', this.userForm.value.last_name);
    formData.append('dob', this.userForm.value.dob);
    formData.append('type', this.userForm.value.type);
    formData.append('city', this.userForm.value.city);
    formData.append('state', this.userForm.value.state);
    formData.append('postal_code', this.userForm.value.postal_code);

    if (this.selectedFile) {
      formData.append('profile_image', this.selectedFile);
    }

    if (this.isEditMode) {
      this.usersService.updateUser(this.userId, formData).subscribe({
        next: () => {
          this.router.navigate(['/admin/users']);
        },
        error: (err: any) => {
          console.error('Error updating User:', err);
        }
      });
    } else {
      this.usersService.createUser(formData).subscribe({
        next: () => {
          this.router.navigate(['/admin/users']);
        },
        error: (err: any) => {
          console.error('Error creating User:', err);
        }
      });
    }
  }
}   