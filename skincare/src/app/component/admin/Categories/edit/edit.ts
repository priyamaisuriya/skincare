import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../../service/categories';


@Component({
  selector: 'app-edit',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit implements OnInit {

  categoryForm!: FormGroup;
  isEditMode = false;
  categoryId: number = 0;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image_url: [''],
      parent_id: [0],
      sort_order: ['', Validators.required],
      home_page: [false],
      status: [false],
      is_menu: [false],
      meta_title: ['', Validators.required],
      meta_description: ['', Validators.required],
      meta_keyword: ['', Validators.required],
      page_title: ['', Validators.required],
    });
  }

  ngOnInit(): void {
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
            image_url: rootData.image_url,
            parent_id: rootData.parent_id,
            sort_order: rootData.sort_order,
            home_page: rootData.home_page,
            status: rootData.status,
            is_menu: rootData.is_menu,
            meta_title: rootData.meta_title,
            meta_description: rootData.meta_description,
            meta_keyword: rootData.meta_keyword,
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
    this.categoryForm.markAllAsTouched();
    if (this.categoryForm.invalid) return;

    const payload = { ...this.categoryForm.value, id: this.categoryId };

    if (this.selectedFile) {
      payload.image_url = this.selectedFile;
    }


    if (this.isEditMode) {
      this.categoriesService.updateCategory(this.categoryId, payload).subscribe({
        next: () => {
          this.router.navigate(['/admin/categories']);
        },
        error: (err: any) => {
          console.error('Error updating category:', err);
        }
      });
    } else {
      this.categoriesService.createCategory(payload).subscribe({
        next: () => {
          this.router.navigate(['/admin/categories']);
        },
        error: (err: any) => {
          console.error('Error creating category:', err);
        }
      });
    }
  }
} 