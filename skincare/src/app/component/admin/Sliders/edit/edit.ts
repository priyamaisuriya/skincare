import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SliderService } from '../../../../service/slider';

@Component({
  selector: 'app-edit',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit implements OnInit {
  sliderForm!: FormGroup;
  isEditMode = false;
  sliderId: number = 0;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private sliderService: SliderService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.sliderForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      link: ['', Validators.required],
      sort_order: ['', Validators.required],
      status: [false]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.sliderId = +idParam;

      this.sliderService.getSliderById(this.sliderId).subscribe({
        next: (response: any) => {
          const rootData = response.data || response;
          console.log('Loaded Slider Data:', rootData);

          this.sliderForm.patchValue({
            name: rootData.name,
            description: rootData.description,
            link: rootData.link,
            sort_order: rootData.sort_order,
            status: rootData.status == 1 || rootData.status == true
          });

          if (rootData.image_url) {
            this.imagePreview = `http://127.0.0.1:8000/storage/${rootData.image_url}`;
          }
        },
        error: (err) => {
          console.error('Error loading Slider:', err);
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

  saveSlider(): void {
    if (this.sliderForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.sliderForm.get('name')?.value);
    formData.append('description', this.sliderForm.get('description')?.value);
    formData.append('link', this.sliderForm.get('link')?.value);
    formData.append('sort_order', this.sliderForm.get('sort_order')?.value);
    formData.append('status', this.sliderForm.get('status')?.value ? '1' : '0');

    if (this.selectedFile) {
      formData.append('image_url', this.selectedFile);
    }

    if (this.isEditMode) {
      this.sliderService.updateSlider(this.sliderId, formData).subscribe({
        next: () => {
          this.router.navigate(['/admin/slider']);
        },
        error: (err) => {
          console.error('Error updating Slider:', err);
        }
      });
    } else {
      this.sliderService.createSlider(formData).subscribe({
        next: () => {
          this.router.navigate(['/admin/slider']);
        },
        error: (err) => {
          console.error('Error creating Slider:', err);
        }
      });
    }
  }
}
