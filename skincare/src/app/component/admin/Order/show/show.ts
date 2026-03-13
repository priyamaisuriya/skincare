import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../../service/order';

@Component({
  selector: 'app-show',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './show.html',
  styleUrl: './show.css'
})
export class Show implements OnInit {
  order: any = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('Show Page - Component Initialized');
    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('Show Page - Route ID:', id);
      if (id) {
        this.loadOrder(+id);
      }
    });
  }

  loadOrder(id: number): void {
    console.log('Show Page - Fetching Order ID:', id);
    this.loading = true;
    this.error = null;
    this.order = null; // Reset before fetch

    this.orderService.getOrderById(id).subscribe({
      next: (response: any) => {
        console.log('Show Page - API Success:', response);
        
        // Laravel structure is { status: 'success', data: { ... } }
        if (response && response.data) {
          this.order = response.data;
        } else {
          this.order = response;
        }

        console.log('Show Page - Final Data in memory:', this.order);
        this.loading = false;
        
        // Force change detection just in case
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Show Page - API Error:', err);
        this.error = `Could not load order #${id}. Server responded with: ${err.statusText} (${err.status})`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
