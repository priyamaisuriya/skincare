import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Categories } from '../../../../models/categories';
import { CategoriesService } from '../../../../service/categories';

@Component({
  selector: 'app-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  categories: Categories[] = [];

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.loadCategories();
  }
  loadCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
  deleteCategory(id: number) {
    this.categoriesService.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error deleting category:', error);
      }
    });
  }
}
