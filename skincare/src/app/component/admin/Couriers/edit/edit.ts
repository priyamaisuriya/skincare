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

  constructor(
    private courierService: CouriersService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.courierForm = this.fb.group({
      name: ['', Validators.required],
      website: [''],
      email: ['', [Validators.email]],
      phone: [''],
      address: [''],
      city: [''],
      state: [''],
      postal_code: [''],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.courierId = +idParam;
      this.loadCourier();
    }
  }

  loadCourier(): void {
    this.courierService.getCourierById(this.courierId).subscribe({
      next: (response: any) => {
        const rootData = response.data || response;
        console.log('Courier Edit - Loaded Data:', rootData);

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
      },
      error: (err) => {
        console.error('Courier Edit - Error loading record:', err);
        alert('Failed to load courier data.');
      }
    });
  }

  saveCourier(): void {
    if (this.courierForm.invalid) {
      this.courierForm.markAllAsTouched();
      return;
    }

    const payload = this.courierForm.value;
    console.log('Courier Edit - Saving payload:', payload);

    const request = this.isEditMode
      ? this.courierService.updateCourier(this.courierId, payload)
      : this.courierService.createCourier(payload);

    request.subscribe({
      next: (resp) => {
        console.log('Courier Edit - Save success:', resp);
        alert(this.isEditMode ? 'Courier updated successfully!' : 'Courier added successfully!');
        this.router.navigate(['/admin/courier']);
      },
      error: (err) => {
        console.error('Courier Edit - Save error:', err);
        alert(err.error?.message || 'Error saving courier. Please try again.');
      }
    });
  }
}