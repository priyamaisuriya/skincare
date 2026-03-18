import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DashboardService } from '../../../service/dashboard';
import { RouterLink } from '@angular/router';

declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  dashboardData = signal<any>({
    summary: {
      total_orders: 0,
      total_sales: 0,
      total_users: 0,
      pending_orders_count: 0,
      shipped_orders_count: 0,
      delivered_orders_count: 0,
    },
    recent_orders: [],
    top_products: [],
    best_sellers: [],
    chart_data: { labels: [], values: [] }
  });
  currentMonth: string = '';

  constructor(
    private dashboardService: DashboardService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    this.currentMonth = monthNames[new Date().getMonth()];
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        console.log('Dashboard Data Received:', response);
        if (response.status === 'success') {
          this.dashboardData.set(response.data);
          if (isPlatformBrowser(this.platformId)) {
            // Increased timeout slightly to ensure DOM is ready
            setTimeout(() => this.initChart(), 300);
          }
        }
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
      }
    });
  }

  initChart(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Small Sparkline Charts
    this.initSparkline('balance-chart', [10, 20, 15, 30, 25, 40, 35], '#f3f6f8');
    this.initSparkline('sales-chart', [5, 10, 8, 15, 12, 20, 18], '#f3f6f8');

    // Main Sales Chart
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    if (canvas && typeof Chart !== 'undefined') {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const labels = this.dashboardData()?.chart_data?.labels || [];
        const values = this.dashboardData()?.chart_data?.values || [];

        console.log('Initializing Chart with:', { labels, values });

        new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Sales',
              data: values,
              borderWidth: 2,
              backgroundColor: 'rgba(63,82,227,.8)',
              borderColor: 'transparent',
              pointBorderWidth: 0,
              pointRadius: 3.5,
              pointBackgroundColor: 'transparent',
              pointHoverBackgroundColor: 'rgba(63,82,227,.8)',
            }]
          },
          options: {
            legend: { display: false },
            scales: {
              yAxes: [{
                gridLines: { drawBorder: false, color: '#f2f2f2' },
                ticks: {
                  beginAtZero: true,
                  callback: (value: any) => '₹' + value
                }
              }],
              xAxes: [{ gridLines: { display: false, tickMarkLength: 15 } }]
            },
          }
        });
      }
    } else {
      console.warn('Canvas or Chart.js not found:', { canvas: !!canvas, Chart: typeof Chart });
    }
  }

  initSparkline(id: string, data: number[], color: string): void {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (canvas && typeof Chart !== 'undefined') {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.map((_, i) => i),
            datasets: [{
              data: data,
              borderWidth: 2,
              backgroundColor: color,
              borderColor: 'transparent',
              pointBorderWidth: 0,
              pointRadius: 0,
              pointBackgroundColor: 'transparent',
              pointHoverBackgroundColor: 'transparent',
            }]
          },
          options: {
            legend: { display: false },
            scales: {
              yAxes: [{ display: false }],
              xAxes: [{ display: false }]
            },
          }
        });
      }
    }
  }

  getImageUrl(product: any): string {
    // Check for product_images (snake_case)
    if (product.product_images && product.product_images.length > 0) {
      return `http://127.0.0.1:8000/storage/${product.product_images[0].image_url}`;
    }
    // Check for productImages (camelCase)
    if (product.productImages && product.productImages.length > 0) {
      return `http://127.0.0.1:8000/storage/${product.productImages[0].image_url}`;
    }
    // For top_products which might have a direct image_url property
    if (product.image_url) {
      return `http://127.0.0.1:8000/storage/${product.image_url}`;
    }
    return 'assets/img/products/product-1-50.png';
  }
}
