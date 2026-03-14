import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../../service/order';
import { Order } from '../../../../models/order';

declare const $: any;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  allOrders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadOrders();
    }
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (response: any) => {
        // Handle direct arrays, Laravel data wrapper, and named 'orders' property
        const ordersData = response.data || response.orders || response;
        this.allOrders = Array.isArray(ordersData) ? ordersData : [];

        // Manual change detection before initializing DataTables
        this.cdr.detectChanges();

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            if (!$.fn.DataTable.isDataTable('#orders-table')) {
              this.initDataTable();
            }
          }, 500); // 500ms timeout for stability
        }
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.allOrders = [];
        this.cdr.detectChanges();
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => this.initDataTable(), 500);
        }
      }
    });
  }

  initDataTable(): void {
    if (!isPlatformBrowser(this.platformId) || typeof $ === 'undefined') {
      return;
    }

    if ($.fn.DataTable.isDataTable('#orders-table')) {
      const table = $('#orders-table').DataTable();
      table.destroy();
    }

    $('#orders-table').DataTable({
      columnDefs: [{ orderable: false, targets: [5, 6] }],
      retrieve: true
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
    console.log('Delete order items for order:', id);
  }

  showOrder(id: number): void {
    console.log('Show order:', id);
  }

  editOrder(id: number): void {
    this.router.navigate(['/admin/order/edit', id]);
  }
}
