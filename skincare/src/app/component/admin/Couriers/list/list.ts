import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CouriersService } from '../../../../service/couriers';
import { Couriers } from '../../../../models/couriers';

declare const $: any;


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  private couriersSubject = new BehaviorSubject<Couriers[]>([]);
  couriers$: Observable<Couriers[]> = this.couriersSubject.asObservable();

  constructor(
    private couriersService: CouriersService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.loadCouriers();
  }
  loadCouriers(): void {
    this.couriersService.getAllCouriers().subscribe({
      next: (data: any) => {
        const couriersData = data.data || data;
        this.couriersSubject.next(couriersData);
        this.cdr.detectChanges();

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.initDataTable();
          }, 100);
        }
      },
      error: (err) => {
        console.error('Error loading Couriers:', err);
      }
    });
  }

  initDataTable(): void {
    if (!isPlatformBrowser(this.platformId) || typeof $ === 'undefined') {
      return;
    }

    if ($.fn.DataTable.isDataTable('#couriers-table')) {
      $('#couriers-table').DataTable().destroy();
    }

    $('#couriers-table').DataTable({
      columnDefs: [{ orderable: false, targets: [4, 5] }]
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
