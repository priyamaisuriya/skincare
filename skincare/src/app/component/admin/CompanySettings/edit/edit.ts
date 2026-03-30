import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.companySettingsForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      address: ['', Validators.required],
      facebook_url: [''],
      instagram_url: [''],
      whatsapp_url: [''],
      site_name: ['', Validators.required],
      meta_title: [''],
      meta_description: [''],
      meta_keyword: [''],
      page_title: [''],
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCompanySettings();
    }
  }

  loadCompanySettings(): void {
    // We fetch all records and default to the first one available
    this.companySettingsService.getCompanySettings().subscribe({
      next: (response: any) => {
        // If it returns a standard wrapper
        const results = response.data || response;
        const rootData = Array.isArray(results) ? results[0] : results;

        if (rootData) {
          console.log('Loaded Company Settings Data:', rootData);
          this.isEditMode = true;
          this.companySettingsId = rootData.id;
          console.log('Final mapping data:', rootData);

          this.companySettingsForm.patchValue({
            name: rootData.name,
            description: rootData.description,
            email: rootData.email,
            phone_number: rootData.phone_number,
            address: rootData.address,
            facebook_url: rootData.facebook_url,
            instagram_url: rootData.instagram_url || rootData.instragram_url || '',
            whatsapp_url: rootData.whatsapp_url,
            site_name: rootData.site_name,
            meta_title: rootData.meta_title,
            meta_description: rootData.meta_description,
            meta_keyword: rootData.meta_keyword || rootData.meta_keywords || '',
            page_title: rootData.page_title,
          });

          if (rootData.logo) {
            this.logoPreview = `http://127.0.0.1:8000/storage/${rootData.logo}`;
          }
          if (rootData.favicon) {
            this.faviconPreview = `http://127.0.0.1:8000/storage/${rootData.favicon}`;
          }
        } else {
          this.isEditMode = false;
        }
      },
      error: (err: any) => {
        console.error('Error loading Company Settings:', err);
      }
    });
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
    console.log('Attempting to save Company Settings...');
    this.companySettingsForm.markAllAsTouched();

    if (this.companySettingsForm.invalid) {
      console.warn('Form is invalid. Validation Errors:');
      Object.keys(this.companySettingsForm.controls).forEach(key => {
        const control = this.companySettingsForm.get(key);
        if (control?.invalid) {
          console.log(`- ${key}:`, control.errors);
        }
      });
      if (isPlatformBrowser(this.platformId)) {
        alert('Please fill in all required fields.');
      }
      return;
    }

    const formData = new FormData();
    formData.append('name', this.companySettingsForm.get('name')?.value || '');
    formData.append('description', this.companySettingsForm.get('description')?.value || '');
    formData.append('email', this.companySettingsForm.get('email')?.value || '');
    formData.append('phone_number', this.companySettingsForm.get('phone_number')?.value || '');
    formData.append('address', this.companySettingsForm.get('address')?.value || '');
    formData.append('facebook_url', this.companySettingsForm.get('facebook_url')?.value || '');
    const instaUrl = this.companySettingsForm.get('instagram_url')?.value || '';
    formData.append('instagram_url', instaUrl);
    formData.append('instragram_url', instaUrl); // Misspelled version for backend compatibility
    formData.append('whatsapp_url', this.companySettingsForm.get('whatsapp_url')?.value || '');
    formData.append('site_name', this.companySettingsForm.get('site_name')?.value || '');
    formData.append('meta_title', this.companySettingsForm.get('meta_title')?.value || '');
    formData.append('meta_description', this.companySettingsForm.get('meta_description')?.value || '');
    formData.append('meta_keyword', this.companySettingsForm.get('meta_keyword')?.value || '');
    formData.append('page_title', this.companySettingsForm.get('page_title')?.value || '');

    if (this.logoFile) {
      formData.append('logo', this.logoFile);
    }
    if (this.faviconFile) {
      formData.append('favicon', this.faviconFile);
    }

    console.log('Form data prepared. Mode:', this.isEditMode ? 'Update' : 'Create', 'ID:', this.companySettingsId);

    if (this.isEditMode && this.companySettingsId > 0) {
      // Append ID to body just in case backend requires it
      formData.append('id', this.companySettingsId.toString());

      // Send meta_keywords (plural) as well for compatibility
      formData.append('meta_keywords', this.companySettingsForm.get('meta_keyword')?.value || '');

      this.companySettingsService.updateCompanySettings(this.companySettingsId, formData).subscribe({
        next: (resp) => {
          console.log('Update Success:', resp);
          alert('Company Settings updated successfully!');
          this.loadCompanySettings();
        },
        error: (err: any) => {
          console.error('Update Error Detail:', err);
          const msg = err.error?.message || (err.error && typeof err.error === 'string' ? err.error : 'Server Error');
          if (isPlatformBrowser(this.platformId)) {
            alert(`Failed to update settings. Error: ${msg}`);
          }
        }
      });
    } else {
      this.companySettingsService.createCompanySettings(formData).subscribe({
        next: (resp) => {
          console.log('Create Success:', resp);
          alert('Company Settings created successfully!');
          this.loadCompanySettings();
        },
        error: (err: any) => {
          console.error('Create Error Detail:', err);
          const msg = err.error?.message || (err.error && typeof err.error === 'string' ? err.error : 'Server Error');
          if (isPlatformBrowser(this.platformId)) {
            alert(`Failed to create settings. Error: ${msg}`);
          }
        }
      });
    }
  }
}