import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../../service/order';
import { Order } from '../../../../models/order';
import { OrderItems } from '../../../../models/order-items';
@Component({
  selector: 'app-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  orders: Order[] = [];
  constructor(private orderService: OrderService) { }
  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        console.log('data.', data)

      },
      error: (err) => {
        console.error('Error loading orders:', err);
      }
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
    // Navigate to edit order page
    console.log('Edit order:', id);
  }
}
