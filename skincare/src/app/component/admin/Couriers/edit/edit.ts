import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CouriersService } from '../../../../service/couriers';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class CourierEdit implements OnInit {
  courierForm!: FormGroup;
  isEditMode = false;
  courierId: number = 0;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private courierService: CouriersService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.courierForm = this.fb.group({
      name: ['', Validators.required],
      website: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postal_code: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.courierId = +idParam;

      this.courierService.getCourierById(this.courierId).subscribe({
        next: (response: any) => {
          const rootData = response.data || response;
          console.log('Loaded Courier Data:', rootData);

          this.courierForm.patchValue({
            name: rootData.name,
            website: rootData.website,
            email: rootData.email,
            phone: rootData.phone,
            address: rootData.address,
            city: rootData.city,
            state: rootData.state,
            postal_code: rootData.postal_code,
          });

          if (rootData.image_url) {
            this.imagePreview = `http://127.0.0.1:8000/storage/${rootData.image_url}`;
          }
        },
        error: (err) => {
          console.error('Error loading Courier:', err);
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

  saveCourier(): void {
    console.log('Attempting to save courier...');
    this.courierForm.markAllAsTouched();

    if (this.courierForm.invalid) {
      console.warn('Courier form is invalid. Details:');
      Object.keys(this.courierForm.controls).forEach(key => {
        const control = this.courierForm.get(key);
        if (control?.invalid) {
          console.log(`- ${key}:`, control.errors);
        }
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', this.courierForm.get('name')?.value || '');
    formData.append('website', this.courierForm.get('website')?.value || '');
    formData.append('email', this.courierForm.get('email')?.value || '');
    formData.append('phone', this.courierForm.get('phone')?.value || '');
    formData.append('address', this.courierForm.get('address')?.value || '');
    formData.append('city', this.courierForm.get('city')?.value || '');
    formData.append('state', this.courierForm.get('state')?.value || '');
    formData.append('postal_code', this.courierForm.get('postal_code')?.value || '');

    if (this.selectedFile) {
      formData.append('image_url', this.selectedFile);
    }

    console.log('Form data prepared, sending to server...');

    const request = this.isEditMode
      ? this.courierService.updateCourier(this.courierId, formData)
      : this.courierService.createCourier(formData);

    request.subscribe({
      next: (resp) => {
        console.log('Courier saved successfully:', resp);
        alert(this.isEditMode ? 'Courier updated successfully!' : 'Courier added successfully!');
        this.router.navigate(['/admin/courier']);
      },
      error: (err) => {
        console.error('Error saving Courier:', err);
        alert('Failed to save courier. Check console for details.');
      }
    });
  }
}