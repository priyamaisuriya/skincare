import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { OrderService } from '../../../../service/order';
import { CouriersService } from '../../../../service/couriers';
import { Couriers } from '../../../../models/couriers';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit implements OnInit {
  orderForm!: FormGroup;
  isEditMode = false;
  orderId: number = 0;
  orderData: any = null;
  couriers: Couriers[] = [];
  loadingCouriers: boolean = false;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private courierService: CouriersService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.orderForm = this.fb.group({
      customer_id: [null],
      customer_name: ['', Validators.required],
      customer_email: ['', [Validators.required, Validators.email]],
      customer_phone: [''],
      customer_address: ['', Validators.required],
      customer_city: [''],
      customer_state: [''],
      customer_postal_code: [''],
      customer_country: [''],
      order_date: [new Date().toISOString().split('T')[0], Validators.required],
      status: ['pending', Validators.required],
      total_amount: [0, [Validators.required, Validators.min(0)]],
      sub_amount: [0],
      discount: [0],
      shipping_amount: [0],
      delivery_charge: [0],
      quantity: [1, [Validators.required, Validators.min(1)]],
      source: ['Direct'],
      payment_id: [''],
      shipping_id: [''],
      courier_id: [''],
      tracking_id: [''],
      est_delivery_date: [''],
      delivery_date: [''],
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCouriers();
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.orderId = +idParam;
        this.loadOrder();
      }
    }
  }

  loadCouriers(): void {
    this.loadingCouriers = true;
    this.courierService.getAllCouriers().subscribe({
      next: (response: any) => {
        this.loadingCouriers = false;
        const data = response.data || response.couriers || response;
        this.couriers = Array.isArray(data) ? data : [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading couriers:', err);
        this.loadingCouriers = false;
        this.cdr.detectChanges();
      }
    });
  }

  trackByCourierId(index: number, courier: Couriers): number {
    return courier.id;
  }

  getCourierName(id: any): string {
    if (!id) return '';
    const courier = this.couriers.find(c => c.id === Number(id));
    return courier ? courier.name : '';
  }

  loadOrder(): void {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response: any) => {
        const data = response.data || response;
        this.orderData = data;

        // Patch values to form
        this.orderForm.patchValue({
          customer_id: data.customer_id,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone,
          customer_address: data.customer_address,
          customer_city: data.customer_city,
          customer_state: data.customer_state,
          customer_postal_code: data.customer_postal_code,
          customer_country: data.customer_country,
          order_date: data.order_date,
          status: data.status,
          total_amount: data.total_amount,
          sub_amount: data.sub_amount,
          discount: data.discount,
          shipping_amount: data.shipping_amount,
          delivery_charge: data.delivery_charge,
          quantity: data.quantity,
          source: data.source,
          payment_id: data.payment_id,
          shipping_id: data.shipping_id,
          courier_id: data.courier_id ? Number(data.courier_id) : '',
          tracking_id: data.tracking_id || '',
          est_delivery_date: data.est_delivery_date,
          delivery_date: data.delivery_date,
        });
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading Order:', err);
      }
    });
  }

  updateOrder(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const payload = this.orderForm.value;

    if (this.isEditMode) {
      this.orderService.updateOrder(this.orderId, payload).subscribe({
        next: () => {
          alert('Order updated successfully!');
          this.router.navigate(['/admin/orders']);
        },
        error: (err: any) => {
          console.error('Error updating order:', err);
          alert(err.error?.message || 'Error updating order!');
        }
      });
    } else {
      this.orderService.createOrder(payload).subscribe({
        next: () => {
          alert('Order created successfully!');
          this.router.navigate(['/admin/orders']);
        },
        error: (err: any) => {
          console.error('Error creating order:', err);
          alert(err.error?.message || 'Error creating order!');
        }
      });
    }
  }
}