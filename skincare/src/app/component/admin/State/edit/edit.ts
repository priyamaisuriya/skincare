import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateService } from '../../../../service/state';
import e from 'express';

@Component({
  selector: 'app-edit',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit implements OnInit { 
  stateForm: FormGroup;
  isEditMode = false;
  sliderId: number = 0;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.stateForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const idparam = this.route.snapshot.paramMap.get('id');
    if (idparam) {
      this.isEditMode = true;
      this.sliderId = +idparam;
      this.stateService.getStateById(this.sliderId).subscribe({
        next: (response: any) => {
          const rootData = response.data || response;
          console.log('Loaded State Data:', rootData);

          this.stateForm.patchValue({
            name: rootData.name,
            code: rootData.code,
          });
        },
        error: (err) => {
          console.error('Error loading State:', err);
        }
      });
    }
  }
  saveState(): void {
    this.stateForm.markAllAsTouched();
    if (this.stateForm.invalid) return;
    const payload = { ...this.stateForm.value, id: this.sliderId };

    if (this.isEditMode) {
      this.stateService.updateState(this.sliderId, payload).subscribe({
        next: () => {
          this.router.navigate(['/admin/states']);
        },
        error: (err) => {
          console.error('Error updating State:', err);
        }
      });
    }else {
      this.stateService.createState(payload).subscribe({
        next: () => {
          this.router.navigate(['/admin/states']);
        },
        error: (err) => {
          console.error('Error creating State:', err);
        }
      });
    }
  } 
}

  