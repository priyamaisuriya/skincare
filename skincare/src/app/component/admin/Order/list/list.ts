import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { BehaviorSubject, Observable } from 'rxjs';
import { OrderService } from '../../../../service/order';
import { Order } from '../../../../models/order';
import { OrderItems } from '../../../../models/order-items';

declare const $: any;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$: Observable<Order[]> = this.ordersSubject.asObservable();
  constructor(
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  ngOnInit(): void {
    this.loadOrders();
  }



  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        const ordersData = data.data || data;
        this.ordersSubject.next(ordersData);
        this.cdr.detectChanges();
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.initDataTable();
          }, 100);
        }
      },
      error: (err) => {
        console.error('Error loading orders:', err);
      }
    });
  }

  initDataTable(): void {
    if (!isPlatformBrowser(this.platformId) || typeof $ === 'undefined') {
      return;
    }

    if ($.fn.DataTable.isDataTable('#orders-table')) {
      $('#orders-table').DataTable().destroy();
    }

    $('#orders-table').DataTable({
      columnDefs: [{ orderable: false, targets: [5, 6] }]
    });
  }
  deleteOrder(id: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.loadOrders();
        },
        error: (err) => {
          console.error('Error deleting order:', err);
        }
      });
    }
  }
  deleteOrderItems(id: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.loadOrders();
        },
        error: (err) => {
          console.error('Error deleting order:', err);
        }
      });
    }
  }

  showOrder(id: number): void {
    // Navigate to show order page
    console.log('Show order:', id);
  }

  editOrder(id: number): void {
    this.router.navigate(['/admin/order/edit', id]);
  }
}
