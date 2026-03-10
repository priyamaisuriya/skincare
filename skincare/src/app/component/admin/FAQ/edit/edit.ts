import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FaqService } from '../../../../service/faq';

@Component({
  selector: 'app-edit',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit implements OnInit {
  faqForm!: FormGroup;
  isEditMode = false;
  faqId: number = 0;

  constructor(
    private faqService: FaqService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.faqForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.faqId = +idParam;

      this.faqService.getFaqById(this.faqId).subscribe({
        next: (response) => {
          const rootData = response.data || response;
          console.log('Loaded FAQ Data:', rootData);

          this.faqForm.patchValue({
            question: rootData.question,
            answer: rootData.answer
          });
        },
        error: (err) => {
          console.error('Error loading FAQ:', err);
        }
      });
    }
  }

  saveFaq(): void {
    this.faqForm.markAllAsTouched();
    if (this.faqForm.invalid) return;

    const payload = { ...this.faqForm.value, id: this.faqId };

    if (this.isEditMode) {
      this.faqService.updateFaq(this.faqId, payload).subscribe({
        next: () => {
          this.router.navigate(['/admin/faq']);
        },
        error: (err) => {
          console.error('Error updating FAQ:', err);
        }
      });
    } else {
      this.faqService.createFaq(payload).subscribe({
        next: () => {
          this.router.navigate(['/admin/faq']);
        },
        error: (err) => {
          console.error('Error creating FAQ:', err);
        }
      });
    }
  }
}
