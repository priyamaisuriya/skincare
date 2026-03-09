import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FaqService } from '../../../../service/faq';
import { Faq } from '../../../../models/faq';
@Component({
  selector: 'app-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  faqs: Faq[] = [];

  constructor(private faqService: FaqService) { }

  ngOnInit(): void {
    this.loadFaqs();
  }

  loadFaqs(): void {
    this.faqService.getAllFaqs().subscribe({
      next: (data) => {
        this.faqs = data;
      },
      error: (err) => {
        console.error('Error loading FAQs:', err);
      }
    });
  }

  deleteFaq(id: number): void {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      this.faqService.deleteFaq(id).subscribe({
        next: () => {
          this.loadFaqs();
        },
        error: (err) => {
          console.error('Error deleting FAQ:', err);
        }
      });
    }
  }
}
