import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../../service/order';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit implements OnInit {
  orderForm!: FormGroup;
  isEditMode = false;
  orderId: number = 0;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  orders: any[] = [];


  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      customer_id: ['', Validators.required],
      order_date: ['', Validators.required],
      total_amount: ['', Validators.required],
      status: ['', Validators.required],
      payment_id: ['', Validators.required],
      shipping_id: ['', Validators.required],
      customer_name: ['', Validators.required],
      customer_email: ['', Validators.required],
      customer_phone: ['', Validators.required],
      customer_address: ['', Validators.required],
      customer_city: ['', Validators.required],
      customer_state: ['', Validators.required],
      customer_postal_code: ['', Validators.required],
      customer_country: ['', Validators.required],
      quantity: ['', Validators.required],
      discount: ['', Validators.required],
      sub_amount: ['', Validators.required],
      shipping_amount: ['', Validators.required],
      delivery_charge: ['', Validators.required],
      source: ['', Validators.required],
      courier_id: ['', Validators.required],
      tracking_id: ['', Validators.required],
      est_delivery_date: ['', Validators.required],
      delivery_date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadOrders();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.orderId = +idParam;

      this.orderService.getOrderById(this.orderId).subscribe({
        next: (response: any) => {
          const rootData = response.data || response;
          console.log('Loaded Order Data:', rootData);

          this.orderForm.patchValue({
            customer_id: rootData.customer_id,
            order_date: rootData.order_date,
            total_amount: rootData.total_amount,
            status: rootData.status,
            payment_id: rootData.payment_id,
            shipping_id: rootData.shipping_id,
            customer_name: rootData.customer_name,
            customer_email: rootData.customer_email,
            customer_phone: rootData.customer_phone,
            customer_address: rootData.customer_address,
            customer_city: rootData.customer_city,
            customer_state: rootData.customer_state,
            customer_postal_code: rootData.customer_postal_code,
            customer_country: rootData.customer_country,
            quantity: rootData.quantity,
            discount: rootData.discount,
            sub_amount: rootData.sub_amount,
            shipping_amount: rootData.shipping_amount,
            delivery_charge: rootData.delivery_charge,
            source: rootData.source,
            courier_id: rootData.courier_id,
            tracking_id: rootData.tracking_id,
            est_delivery_date: rootData.est_delivery_date,
            delivery_date: rootData.delivery_date,
          });
          if (rootData.status == 1) {
            this.orderForm.get('status')?.setValue(true);
          } else {
            this.orderForm.get('status')?.setValue(false);
          }
        },
        error: (err: any) => {
          console.error('Error loading Order:', err);
        }
      });
    }
  }
  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (response: any) => {
        this.orders = response.data || response;
        console.log('Loaded Orders:', this.orders);
      },
      error: (err: any) => {
        console.error('Error loading Orders:', err);
      }
    });
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
  updateOrder(): void {
    this.orderForm.markAllAsTouched();
    if (this.orderForm.invalid) return;

    const formData = new FormData();
    formData.append('customer_id', this.orderForm.get('customer_id')?.value);
    formData.append('order_date', this.orderForm.get('order_date')?.value);
    formData.append('total_amount', this.orderForm.get('total_amount')?.value);
    formData.append('status', this.orderForm.get('status')?.value ? '1' : '0');
    formData.append('payment_id', this.orderForm.get('payment_id')?.value);
    formData.append('shipping_id', this.orderForm.get('shipping_id')?.value);
    formData.append('customer_name', this.orderForm.get('customer_name')?.value);
    formData.append('customer_email', this.orderForm.get('customer_email')?.value);
    formData.append('customer_phone', this.orderForm.get('customer_phone')?.value);
    formData.append('customer_address', this.orderForm.get('customer_address')?.value);
    formData.append('customer_city', this.orderForm.get('customer_city')?.value);
    formData.append('customer_state', this.orderForm.get('customer_state')?.value);
    formData.append('customer_postal_code', this.orderForm.get('customer_postal_code')?.value);
    formData.append('customer_country', this.orderForm.get('customer_country')?.value);
    formData.append('quantity', this.orderForm.get('quantity')?.value);
    formData.append('discount', this.orderForm.get('discount')?.value);
    formData.append('sub_amount', this.orderForm.get('sub_amount')?.value);
    formData.append('shipping_amount', this.orderForm.get('shipping_amount')?.value);
    formData.append('delivery_charge', this.orderForm.get('delivery_charge')?.value);
    formData.append('source', this.orderForm.get('source')?.value);
    formData.append('courier_id', this.orderForm.get('courier_id')?.value);
    formData.append('tracking_id', this.orderForm.get('tracking_id')?.value);
    formData.append('est_delivery_date', this.orderForm.get('est_delivery_date')?.value);
    formData.append('delivery_date', this.orderForm.get('delivery_date')?.value);

    if (this.selectedFile) {
      formData.append('image_url', this.selectedFile);
    }

    if (this.isEditMode) {
      this.orderService.updateOrder(this.orderId, formData).subscribe({
        next: () => {
          alert('Order updated successfully!');
          this.router.navigate(['/admin/orders']);
        },
        error: (err: any) => {
          console.error('Error updating order:', err);
          alert('Error updating order!');
        }
      });
    } else {
      this.orderService.createOrder(formData).subscribe({
        next: () => {
          alert('Order created successfully!');
          this.router.navigate(['/admin/orders']);
        },
        error: (err: any) => {
          console.error('Error creating order:', err);
          alert('Error creating order!');
        }
      });
    }
  }
}