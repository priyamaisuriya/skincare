import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../../service/categories';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class CategoriesEdit implements OnInit {

  categoryForm!: FormGroup;
  isEditMode = false;
  categoryId: number = 0;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  parentCategories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      parent_id: [0],
      sort_order: ['', Validators.required],
      home_page: [false],
      status: [false],
      is_menu: [false],
      meta_title: ['', Validators.required],
      meta_description: ['', Validators.required],
      meta_keywords: ['', Validators.required],
      page_title: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadParentCategories();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.categoryId = +idParam;

      this.categoriesService.getCategoryById(this.categoryId).subscribe({
        next: (response: any) => {
          const rootData = response.data || response;
          console.log('Loaded Category Data:', rootData);

          this.categoryForm.patchValue({
            name: rootData.name,
            description: rootData.description,
            parent_id: rootData.parent_id,
            sort_order: rootData.sort_order,
            home_page: rootData.home_page == 1 || rootData.home_page == true,
            status: rootData.status == 1 || rootData.status == true,
            is_menu: rootData.is_menu == 1 || rootData.is_menu == true,
            meta_title: rootData.meta_title,
            meta_description: rootData.meta_description,
            meta_keywords: rootData.meta_keywords || rootData.meta_keyword,
            page_title: rootData.page_title,
          });

          if (rootData.image_url) {
            this.imagePreview = `http://127.0.0.1:8000/storage/${rootData.image_url}`;
          }
        },
        error: (err: any) => {
          console.error('Error loading category:', err);
        }
      });
    }
  }

  loadParentCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (response: any) => {
        const data = response.data || response;
        // Don't list the current category as its own parent
        this.parentCategories = this.isEditMode
          ? data.filter((cat: any) => cat.id !== this.categoryId)
          : data;
      },
      error: (err: any) => {
        console.error('Error loading parent categories:', err);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveCategory(): void {
    console.log('Attempting to save category...');
    this.categoryForm.markAllAsTouched();

    if (this.categoryForm.invalid) {
      console.warn('Form is invalid. Cannot save.');
      // Log specific invalid controls for debugging
      Object.keys(this.categoryForm.controls).forEach(key => {
        const control = this.categoryForm.get(key);
        if (control?.invalid) {
          console.log(`Invalid control: ${key}`, control.errors);
        }
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', this.categoryForm.get('name')?.value || '');
    formData.append('description', this.categoryForm.get('description')?.value || '');
    formData.append('parent_id', (this.categoryForm.get('parent_id')?.value ?? 0).toString());
    formData.append('sort_order', (this.categoryForm.get('sort_order')?.value ?? 0).toString());
    formData.append('home_page', this.categoryForm.get('home_page')?.value ? '1' : '0');
    formData.append('status', this.categoryForm.get('status')?.value ? '1' : '0');
    formData.append('is_menu', this.categoryForm.get('is_menu')?.value ? '1' : '0');
    formData.append('meta_title', this.categoryForm.get('meta_title')?.value || '');
    formData.append('meta_description', this.categoryForm.get('meta_description')?.value || '');
    formData.append('meta_keywords', this.categoryForm.get('meta_keywords')?.value || '');
    formData.append('page_title', this.categoryForm.get('page_title')?.value || '');

    if (this.selectedFile) {
      formData.append('image_url', this.selectedFile);
    }

    console.log('Form data prepared, mode:', this.isEditMode ? 'Update' : 'Create');

    if (this.isEditMode) {
      this.categoriesService.updateCategory(this.categoryId, formData).subscribe({
        next: (resp) => {
          console.log('Category updated successfully:', resp);
          alert('Category updated successfully!');
          this.router.navigate(['/admin/categories']);
        },
        error: (err: any) => {
          console.error('Error updating category:', err);
          alert('Failed to update category. Check console for details.');
        }
      });
    } else {
      this.categoriesService.createCategory(formData).subscribe({
        next: (resp) => {
          console.log('Category created successfully:', resp);
          alert('Category created successfully!');
          this.router.navigate(['/admin/categories']);
        },
        error: (err: any) => {
          console.error('Error creating category:', err);
          alert('Failed to create category. Check console for details.');
        }
      });
    }
  }
}