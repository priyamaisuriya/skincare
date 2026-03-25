import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../../service/state';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit implements OnInit {
  stateForm!: FormGroup;
  isEditMode: boolean = false;
  stateId: number | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.stateForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.stateId = +id;
      this.loadState(this.stateId);
    }
  }

  loadState(id: number): void {
    this.loading = true;
    this.stateService.getStateById(id).subscribe({
      next: (response) => {
        const data = response.data || response;
        this.stateForm.patchValue({
          name: data.name,
          code: data.code
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading state:', err);
        this.loading = false;
        alert('Failed to load state details.');
      }
    });
  }

  saveState(): void {
    if (this.stateForm.invalid) {
      this.stateForm.markAllAsTouched();
      return;
    }

    const stateData = this.stateForm.value;
    if (this.isEditMode && this.stateId) {
      this.stateService.updateState(this.stateId, stateData).subscribe({
        next: () => {
          this.router.navigate(['/admin/state']);
        },
        error: (err) => {
          console.error('Error updating state:', err);
          alert('Failed to update state.');
        }
      });
    } else {
      this.stateService.createState(stateData).subscribe({
        next: () => {
          this.router.navigate(['/admin/state']);
        },
        error: (err) => {
          console.error('Error creating state:', err);
          alert('Failed to create state.');
        }
      });
    }
  }
}
