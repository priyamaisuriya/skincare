import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  allCouriers: Couriers[] = [];
  loading: boolean = true;

  constructor(
    private couriersService: CouriersService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.loadCouriers();
  }

  loadCouriers(): void {
    this.loading = true;
    this.couriersService.getAllCouriers().subscribe({
      next: (response: any) => {
        console.log('Couriers List - API Response:', response);
        const data = response.data || response;
        this.allCouriers = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges();

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            if (!$.fn.DataTable.isDataTable('#couriers-table')) {
              this.initDataTable();
            }
            
          }, 100);
        }
      },
      error: (err) => {
        console.error('Couriers List - Error loading data:', err);
        this.allCouriers = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  initDataTable(): void {
    if (!isPlatformBrowser(this.platformId) || typeof $ === 'undefined' || !$.fn.DataTable) {
      return;
    }

    if ($.fn.DataTable.isDataTable('#couriers-table')) {
      $('#couriers-table').DataTable().destroy();
    }

    $('#couriers-table').DataTable({
      columnDefs: [{ orderable: false, targets: [4, 5] }],
      language: {
        emptyTable: "No couriers found."
      }
    });
  }

  deleteCouriers(id: number): void {
    if (confirm('Are you sure you want to delete this courier?')) {
      this.couriersService.deleteCourier(id).subscribe({
        next: () => {
          this.loadCouriers();
        },
        error: (err) => {
          console.error('Couriers List - Error deleting record:', err);
          alert('Failed to delete courier.');
        }
      });
    }
  }
}
