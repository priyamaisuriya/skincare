import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CouriersService } from '../../../../service/couriers';
import { CommonModule } from '@angular/common';
import { Couriers } from '../../../../models/couriers';


@Component({
  selector: 'app-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  couriers: Couriers[] = [];

  constructor(private couriersService: CouriersService) { }

  ngOnInit(): void {
    this.loadCouriers();
  }
  loadCouriers(): void {
    this.couriersService.getAllCouriers().subscribe({
      next: (data) => {
        this.couriers = data;
        console.log('data.', data);
      },
      error: (err) => {
        console.error('Error loading Couriers:', err);
      }
    });
  }

  deleteCouriers(id: number): void {
    if (confirm('Are you sure you want to delete this Courier?')) {
      this.couriersService.deleteCourier(id).subscribe({
        next: () => {
          this.loadCouriers();
        },
        error: (err) => {
          console.error('Error deleting Courier:', err);
        }
      });
    }
  }
}
