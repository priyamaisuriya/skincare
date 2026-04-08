import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductsService } from '../../../../service/products';
import { Products } from '../../../../models/products';

declare const $: any;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  private productsSubject = new BehaviorSubject<Products[]>([]);
  products$: Observable<Products[]> = this.productsSubject.asObservable();
  isSyncing: boolean = false;
  loading: boolean = false;

  constructor(
    private productService: ProductsService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProducts();
    }
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        console.log('Products List - API Response:', response);
        // Handle both direct arrays and Laravel wrapper objects
        const productsData = response.data || response.products || response;
        const productsArray = Array.isArray(productsData) ? productsData : [];

        this.productsSubject.next(productsArray);
        this.loading = false;
        this.cdr.detectChanges();

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            if (typeof $ !== 'undefined' && $.fn.DataTable) {
              this.initDataTable();
            }
          }, 300);
        }
      },
      error: (err) => {
        console.error('Products List - Error loading data:', err);
        this.productsSubject.next([]);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  initDataTable(): void {
    if (!isPlatformBrowser(this.platformId) || typeof $ === 'undefined' || !$.fn.DataTable) {
      return;
    }

    if ($.fn.DataTable.isDataTable('#products-table')) {
      $('#products-table').DataTable().destroy();
    }

    $('#products-table').DataTable({
      columnDefs: [{ orderable: false, targets: [4, 5, 6] }]
    });
  }

  deleteproducts(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error deleting product:', err);
        }
      });
    }
  }

  syncAllToFacebook(): void {
    if (confirm('Are you sure you want to sync all products to Facebook Catalog? This may take a while.')) {
      this.isSyncing = true;
      this.productService.syncFacebookCatalog().subscribe({
        next: (resp) => {
          alert('Sync successful: ' + resp.message);
          this.isSyncing = false;
        },
        error: (err) => {
          console.error('Error syncing to Facebook:', err);
          alert('Sync failed. Check console for details.');
          this.isSyncing = false;
        }
      });
    }
  }
}