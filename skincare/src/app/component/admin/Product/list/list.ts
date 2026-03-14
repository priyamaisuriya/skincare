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
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        // Handle both direct arrays and Laravel wrapper objects
        const productsData = response.data || response.products || response;
        const productsArray = Array.isArray(productsData) ? productsData : [];

        this.productsSubject.next(productsArray);
        this.cdr.detectChanges();

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            if (!$.fn.DataTable.isDataTable('#products-table')) {
            this.initDataTable();
            }
          }, 300);
        }
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  initDataTable(): void {
    if (!isPlatformBrowser(this.platformId) || typeof $ === 'undefined') {
      return;
    }

    if ($.fn.DataTable.isDataTable('#products-table')) {
      $('#products-table').DataTable().destroy();
    }

    $('#products-table').DataTable({
      columnDefs: [{ orderable: false, targets: [1, 6, 7] }]
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
}