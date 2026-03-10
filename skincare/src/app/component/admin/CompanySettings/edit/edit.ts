import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompanySettingsService } from '../../../../service/companysetting';
@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class CompanySettingsEdit implements OnInit {
  companySettingsForm!: FormGroup;
  isEditMode = false;
  companySettingsId: number = 0;
  logoFile: File | null = null;
  faviconFile: File | null = null;
  logoPreview: string | ArrayBuffer | null = null;
  faviconPreview: string | ArrayBuffer | null = null;

  constructor(
    private companySettingsService: CompanySettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.companySettingsForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      email: ['', Validators.required],
      phone_number: ['', Validators.required],
      address: ['', Validators.required],
      facebook_url: ['', Validators.required],
      instragram_url: ['', Validators.required],
      whatsapp_url: ['', Validators.required],
      site_name: ['', Validators.required],
      logo: [''],
      favicon: [''],
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
      this.companySettingsId = +idParam;

      this.companySettingsService.getCompanySettingsById(this.companySettingsId).subscribe({
        next: (response: any) => {
          const rootData = response.data || response;
          console.log('Loaded Company Settings Data:', rootData);

          this.companySettingsForm.patchValue({
            name: rootData.name,
            description: rootData.description,
            email: rootData.email,
            phone_number: rootData.phone_number,
            address: rootData.address,
            facebook_url: rootData.facebook_url,
            instragram_url: rootData.instragram_url,
            whatsapp_url: rootData.whatsapp_url,
            site_name: rootData.site_name,
            meta_title: rootData.meta_title,
            meta_description: rootData.meta_description,
            meta_keyword: rootData.meta_keyword,
            page_title: rootData.page_title,
          });

          if (rootData.logo) {
            this.logoPreview = `http://127.0.0.1:8000/storage/${rootData.logo}`;
          }
          if (rootData.favicon) {
            this.faviconPreview = `http://127.0.0.1:8000/storage/${rootData.favicon}`;
          }
        },
        error: (err: any) => {
          console.error('Error loading Company Settings:', err);
        }
      });
    }
  }

  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onFaviconSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.faviconFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.faviconPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveCompanySettings(): void {
    this.companySettingsForm.markAllAsTouched();
    if (this.companySettingsForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.companySettingsForm.get('name')?.value);
    formData.append('description', this.companySettingsForm.get('description')?.value);
    formData.append('email', this.companySettingsForm.get('email')?.value);
    formData.append('phone_number', this.companySettingsForm.get('phone_number')?.value);
    formData.append('address', this.companySettingsForm.get('address')?.value);
    formData.append('facebook_url', this.companySettingsForm.get('facebook_url')?.value);
    formData.append('instragram_url', this.companySettingsForm.get('instragram_url')?.value);
    formData.append('whatsapp_url', this.companySettingsForm.get('whatsapp_url')?.value);
    formData.append('site_name', this.companySettingsForm.get('site_name')?.value);
    formData.append('meta_title', this.companySettingsForm.get('meta_title')?.value);
    formData.append('meta_description', this.companySettingsForm.get('meta_description')?.value);
    formData.append('meta_keyword', this.companySettingsForm.get('meta_keyword')?.value);
    formData.append('page_title', this.companySettingsForm.get('page_title')?.value);

    if (this.logoFile) {
      formData.append('logo', this.logoFile);
    }
    if (this.faviconFile) {
      formData.append('favicon', this.faviconFile);
    }

    if (this.isEditMode) {
      this.companySettingsService.updateCompanySettings(this.companySettingsId, formData).subscribe({
        next: () => {
          this.router.navigate(['/admin/company-settings']);
        },
        error: (err: any) => {
          console.error('Error updating Company Settings:', err);
        }
      });
    } else {
      this.companySettingsService.createCompanySettings(formData).subscribe({
        next: () => {
          this.router.navigate(['/admin/company-settings']);
        },
        error: (err: any) => {
          console.error('Error creating Company Settings:', err);
        }
      });
    }
  }
}