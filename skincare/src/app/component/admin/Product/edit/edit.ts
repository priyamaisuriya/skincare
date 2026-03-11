import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../../../service/products';
import { CategoriesService } from '../../../../service/categories';
import { Categories } from '../../../../models/categories';
import { Products } from '../../../../models/products';
import { ProductImages } from '../../../../models/product-images';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit implements OnInit {

  productForm!: FormGroup;
  isEditMode = false;
  productId: number = 0;
  categories: Categories[] = [];
  productImages: ProductImages[] = [];
  allProducts: Products[] = [];
  selectedRelatedProductId: number = 0;
  relatedProducts: Products[] = [];
  multipleSelectedFiles: File[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productService: ProductsService,
    private categoriesService: CategoriesService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      category_id: ['', Validators.required],
      short_description: ['', Validators.required],
      long_description: ['', Validators.required],
      mrp: ['', Validators.required],
      discount: ['', Validators.required],
      amount: ['', Validators.required],
      volume_weight: ['', Validators.required],
      is_new: [false],
      home_page: [false],
      status: [false],
      meta_title: ['', Validators.required],
      meta_description: ['', Validators.required],
      meta_keywords: ['', Validators.required],
      page_title: ['', Validators.required],
      best_seller: [false],
      how_to_use: ['', Validators.required],
      shipping_return: ['', Validators.required],

    });
  }
  ngOnInit(): void {
    this.loadCategories();
    this.loadAllProducts();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.productId = +idParam;

      this.productService.getProductById(this.productId).subscribe({
        next: (response: any) => {
          const rootData = response.data || response;
          console.log('Loaded Product Data:', rootData);

          this.productForm.patchValue({
            name: rootData.name,
            slug: rootData.slug,
            category_id: rootData.category_id,
            short_description: rootData.short_description,
            long_description: rootData.long_description,
            mrp: rootData.mrp,
            discount: rootData.discount,
            amount: rootData.amount,
            volume_weight: rootData.volume_weight,
            is_new: rootData.is_new,
            home_page: rootData.home_page,
            status: rootData.status == 1 || rootData.status == true,
            meta_title: rootData.meta_title,
            meta_description: rootData.meta_description,
            meta_keywords: rootData.meta_keywords,
            page_title: rootData.page_title,
            best_seller: rootData.best_seller,
            how_to_use: rootData.how_to_use,
            shipping_return: rootData.shipping_return,
          });

          if (rootData.product_images && rootData.product_images.length > 0) {
            this.productImages = rootData.product_images;
          }

          if (rootData.related_products) {
            this.relatedProducts = rootData.related_products;
          }
        },
        error: (err: any) => {
          console.error('Error loading Product:', err);
        }
      });
    }
  }
  loadProductImage(product: any): string | null {
    // Check if the product itself has an image_url (main image)
    if (product.image_url) {
      return product.image_url;
    }

    // Fallback to searching in allProducts for gallery images if not in the current object
    const p = this.allProducts.find(p => p.id === product.id);
    if (p && p.product_images && p.product_images.length > 0) {
      return p.product_images[0].image_url;
    }

    // Check product_images property on the object passed if it exists
    if (product.product_images && product.product_images.length > 0) {
      return product.product_images[0].image_url;
    }

    return null;
  }
  loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data || response;
        console.log('Loaded Categories:', this.categories);
      },
      error: (err: any) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  loadAllProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        this.allProducts = response.data || response;
      },
      error: (err: any) => {
        console.error('Error loading products:', err);
      }
    });
  }

  // Laravel Method: Multi-image Gallery Upload
  onImagesSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.multipleSelectedFiles = Array.from(files);
    }
  }

  uploadMultipleImages(): void {
    if (this.multipleSelectedFiles.length === 0) return;

    const formData = new FormData();
    formData.append('product_id', this.productId.toString());
    this.multipleSelectedFiles.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    this.productService.uploadProductImage(formData).subscribe({
      next: (response) => {
        alert('Images uploaded successfully!');
        this.multipleSelectedFiles = [];
        // Refresh product data to show new images
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error uploading images:', err);
      }
    });
  }

  deleteImage(imageId: number): void {
    if (confirm('Are you sure you want to delete this image?')) {
      this.productService.deleteProductImage(imageId).subscribe({
        next: () => {
          this.productImages = this.productImages.filter(img => img.id !== imageId);
        },
        error: (err) => {
          console.error('Error deleting image:', err);
        }
      });
    }
  }

  addRelatedProduct(): void {
    if (this.selectedRelatedProductId == 0) return;

    const productToAdd = this.allProducts.find(p => p.id == this.selectedRelatedProductId);
    if (productToAdd && !this.relatedProducts.some(p => p.id == productToAdd.id)) {
      this.relatedProducts.push(productToAdd);
    }
    this.selectedRelatedProductId = 0;
  }

  removeRelatedProduct(productId: number): void {
    this.relatedProducts = this.relatedProducts.filter(p => p.id !== productId);
  }
  saveProduct(): void {
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('slug', this.productForm.get('slug')?.value);
    formData.append('category_id', this.productForm.get('category_id')?.value);
    formData.append('short_description', this.productForm.get('short_description')?.value);
    formData.append('long_description', this.productForm.get('long_description')?.value);
    formData.append('mrp', this.productForm.get('mrp')?.value);
    formData.append('discount', this.productForm.get('discount')?.value);
    formData.append('amount', this.productForm.get('amount')?.value);
    formData.append('volume_weight', this.productForm.get('volume_weight')?.value);
    formData.append('is_new', this.productForm.get('is_new')?.value ? '1' : '0');
    formData.append('home_page', this.productForm.get('home_page')?.value ? '1' : '0');
    formData.append('status', this.productForm.get('status')?.value ? '1' : '0');
    formData.append('meta_title', this.productForm.get('meta_title')?.value);
    formData.append('meta_description', this.productForm.get('meta_description')?.value);
    formData.append('meta_keywords', this.productForm.get('meta_keywords')?.value);
    formData.append('page_title', this.productForm.get('page_title')?.value);
    formData.append('best_seller', this.productForm.get('best_seller')?.value ? '1' : '0');
    formData.append('how_to_use', this.productForm.get('how_to_use')?.value);
    formData.append('shipping_return', this.productForm.get('shipping_return')?.value);

    // Append related product IDs
    const relatedIds = this.relatedProducts.map(p => p.id);
    relatedIds.forEach((id, index) => {
      formData.append(`related_products[${index}]`, id.toString());
    });

    // Append multiple gallery images (Laravel way: array of files)
    this.multipleSelectedFiles.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    if (this.isEditMode) {
      this.productService.updateProduct(this.productId, formData).subscribe({
        next: () => {
          alert('Product updated successfully!');
          this.router.navigate(['/admin/products']);
        },
        error: (err: any) => {
          console.error('Error updating Product:', err);
          alert('Failed to update product.');
        }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          alert('Product created successfully!');
          this.router.navigate(['/admin/products']);
        },
        error: (err: any) => {
          console.error('Error creating Product:', err);
          alert('Failed to create product.');
        }
      });
    }
  }
}
