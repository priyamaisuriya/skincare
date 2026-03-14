import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

import { Categories } from '../../../../models/categories';
import { CategoriesService } from '../../../../service/categories';

declare const $: any;

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  private categoriesSubject = new BehaviorSubject<Categories[]>([]);
  categories$: Observable<Categories[]> = this.categoriesSubject.asObservable();

  constructor(
    private categoriesService: CategoriesService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }



  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCategories();
    }
  }
  loadCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (data: any) => {
        const categoriesData = data.data || data;
        this.categoriesSubject.next([...categoriesData]);
        this.cdr.detectChanges();

        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            if (!$.fn.DataTable.isDataTable('#categories-table')) {
              this.initDataTable();
            }
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  initDataTable(): void {
    if (!isPlatformBrowser(this.platformId) || typeof $ === 'undefined') {
      return;
    }

    if ($.fn.DataTable.isDataTable('#categories-table')) {
      $('#categories-table').DataTable().destroy();
    }

    $('#categories-table').DataTable({
      columnDefs: [{ orderable: false, targets: [5, 6] }]
    });
  }
  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoriesService.deleteCategory(id).subscribe({
        next: () => {
          alert('Category deleted successfully!');
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('Failed to delete category.');
        }
      });
    }
  }
}
